
const Bin = require('../models/Bin');
const { sendEmail } = require('../utils/email');

exports.createBin = async (req, res, next) => {
  try {
    const bin = new Bin(req.body);
    const doc = await bin.save();
    // eslint-disable-next-line no-underscore-dangle
    // res.status(201).json({ binId: doc._id });
    res.status(201).json(doc);
  } catch (error) {
    next(error); // this will go to the error handler in app.js e.g. if there's a db error above
  }
};

exports.getAllBins = async (req, res, next) => {
  try {
    const list = await Bin.find({}).lean().exec();
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
    const { update, meta } = req.body;
    const result = await Bin.updateOne({ _id: req.params.id }, update).exec();
    if (result.n === 0) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    if (update.current_height) { // go to email,sockets only if there is an update in current_height
      if (update.current_height >= 99) {
        const msg = `<p>Bin ${meta.bin_code} is full.</>
                  <p>Please empty it.</p>
                  <p>Regards, <b>PingBin Team</b></p>`;
        sendEmail(req.headers.userid, 'Bin Full', msg);
      }
      res.locals.sockdata = {
        binId: req.params.id, height: update.current_height
      };
      next();
    } else {
      res.sendStatus(201);
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
