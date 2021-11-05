
const Bin = require('./Bin');
const { sendEmail } = require('../utils/email');

exports.createBin = async (req, res, next) => {
  try {
    const maxHeight = Math.ceil(0.9 * req.body.height);
    const bin = new Bin({ ...req.body, maxHeight });
    const doc = await bin.save();
    // eslint-disable-next-line no-underscore-dangle
    res.status(201).json({ binId: doc._id });
    // res.status(201).json(doc);
  } catch (error) {
    next(error); // this will go to the error handler in app.js e.g. if there's a db error above
  }
};

exports.getAllBins = async (req, res, next) => {
  try {
    const list = await Bin.find({}).populate('assignedTo').lean().exec();
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

exports.getBin = async (req, res, next) => {
  try {
    const bin = await Bin.findById(req.params.id).lean().exec();
    res.status(200).json(bin);
  } catch (error) {
    next(error);
  }
};

exports.updateBin = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const update  = req.body;
    const bin = await Bin.findOneAndUpdate({ _id: req.params.id }, update, { new: true }).exec();
    if (!bin) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    if (update.currentHeight != null) { // go to email and socketio only if there is an update in currentHeight
      const { currentHeight, maxHeight } = bin;
      if (currentHeight >= maxHeight) {
        const msg = `<p>Bin <strong>${bin._id.slice(-6).toUpperCase()}</strong> is full.</>
                  <p>Please empty it.</p>
                  <p>Regards, <b>Interactive WasteBin Team</b></p>`;
        const title = 'Bin Full';
        sendEmail(req.headers.userid, title, msg);
      }
      res.locals.sockdata = {
        binId: req.params.id, currentHeight, maxHeight,
      };
      next();
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.setBinEmptied = async (req, res, next) => {
  try {
    const update = req.body;
    update.lastEmptied = new Date().toISOString();
    const result = await Bin.updateOne({ _id: req.params.id }, update).exec();
    if (result.n === 0) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    res.sendStatus(201);
    const msg = `<p>Bin ${update.bin_code} has been emptied.</>
                <p>Great work</p>
                <p>Regards, <b>PingBin Team</b></p>`;
    sendEmail(req.headers.userid, 'Bin Emptied', msg);
  } catch (error) {
    next(error);
  }
};

exports.deleteBin = async (req, res, next) => {
  try {
    const result = await Bin.deleteOne({ _id: req.params.id }).exec();
    if (result.n === 0) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
