
const winston = require('winston');
const path = require('path');

const appRoot = path.dirname(require.main.filename); // gets the path of the application entry point

const { createLogger, format, transports } = winston;
const { combine, timestamp, json } = format;

// configs for winston transports i.e. file and console
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(timestamp(), json())
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    // json: false,
    colorize: true,
    format: winston.format.simple()
  }
};

const fileTransport = new transports.File(options.file);
const consoleTransport = new transports.Console(options.console);

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  exitOnError: false // do not exit on handled exceptions
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
  logger.add(consoleTransport);
} else {
  logger.add(fileTransport); // otherwise log to file
}

// create a stream object with a 'write' function that will be used by `morgan`
// logger.stream = {
//     write: function(message, encoding) {
// // use the 'info' log level so the output will be picked up by both transports (file and console)
//       logger.info(message);
//     },
// };

module.exports = logger;
