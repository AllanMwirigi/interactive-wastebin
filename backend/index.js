const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
// const compression = require('compression');
require('dotenv').config();

const logger = require('./utils/winston');
const userRoutes = require('./user/user.routes');
const binRoutes = require('./bins/bin.routes');
const auth = require('./middleware/auth');
const { sendEmail } = require('./utils/email');

let originsList;
if (process.env.NODE_ENV === 'development') {
  originsList = ["http://localhost:4200"];
  app.use(morgan('dev'));
} else {
  originsList = ["https://uzapap.surge.sh"]; // TODO: add prod url here
}
// set up cors
const corsOptions = {
  origin: originsList
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// gzip compress response body
// app.use(compression);

// map endpoint path to route file
app.use('/api/v1/users', userRoutes);
// eslint-disable-next-line no-use-before-define
app.use('/api/v1/bins', auth, binRoutes, emitEvent);
app.use('/api/v1', userRoutes); // to allow POST /login route

// any invalid endpoints that don't match the above are handled here
app.use((req, res, next) => {
  if (res.headersSent) {
    // express handles this if headers had already been sent and sth went wrong
    next();
    return;
  }
  // we handle it
  // make a new error instance and forward it to the error-handler using next()
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// custom error handling middleware i.e. for errors passed in next(error)
app.use((err, req, res, next) => {
  // TODO:log these errors
  if (res.headersSent) {
    // express handles the error if headers had already been sent and sth went wrong
    next(err);
    logger.error(`${req.url} | ${err.message}`);
    return;
  }
  // set status to the status code of the error, otherwise 500 is default e.g. for db errors
  res.status(err.status || 500);
  res.set({ 'Content-type': 'application/json' });
  res.json({ message: err.message });
  logger.error(`${req.url} | ${err.message}`);
});

const connOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
};

try {
  mongoose.connect(process.env.MONGO_URI, connOptions);
} catch (error) {
  logger.error(`Mongoose | ${error.message}`);
}
// Get the default connection
const db = mongoose.connection;
db.on('error', (err) => {
  logger.error(`MongoDB | ${err.message}`);
});

const server = http.createServer(app);

// server start listening once connected to db
db.on('open', () => {
  logger.info('MongoDB is up');
  const PORT = process.env.PORT || 4000;
  server.listen(PORT).on('listening', () => logger.info(`Server listening on port ${PORT} | Env: ${process.env.NODE_ENV}`))
    .on('error', (err) => { logger.error(`Server | ${err.message}`); });
});

const io = socketio(server);

// sockets for real time data
io.on('connection', (socket) => {
  // socket.broadcast.emit('hi');
  // logger.debug(`a user has connected: ${socket.client.id}`);
  socket.on('disconnect', () => {
    // logger.debug('a user has disconnected');
  });

  socket.on('binSimulation', ({ userId, simulHeight }) => {
    socket.broadcast.emit('binSimulation', simulHeight);
    const msg = `<p>BIN-SIMUL is full.</>
                <p>Please empty it.</p>
                <p>Regards, <b>PingBin Team</b></p>`;
    if (simulHeight >= 99) {
      sendEmail(userId, 'Bin Full', msg);
    }
  });
});

function emitEvent(req, res, next) {
  try {
    io.emit('bin', res.locals.sockdata);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
