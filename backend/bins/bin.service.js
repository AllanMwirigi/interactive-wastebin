
const Bin = require('./Bin');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

let alertSent = false;
const maxFactor = 0.62 // 0.81

exports.createBin = async (req, res, next) => {
  try {
    const maxHeight = Math.ceil(maxFactor * req.body.height);
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
    const list = await Bin.find({}).populate('assignedTo', '-password').lean().exec();
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
    // let currentHeight = null;
    // NOTE: as the bin fills up, the height decreases. Hv, the progress on the frontend increases
    // const maxH = maxFactor * 26; // TODO: query this value. this should not be hardcoded
    const height = 26; // full height of bin
    const update = req.body;
    const { measuredHeight, lat, lng } = update;
    // const { measuredHeight1, measuredHeight2, lat, lng } = update;
    if (measuredHeight != null) {
      // update['currentHeight'] = maxH - (maxFactor * measuredHeight);
      update['currentHeight'] = height - measuredHeight;
      // update['currentHeight1'] = maxH - (0.81 * measuredHeight);
      // update['currentHeight2'] = maxH - (0.81 * measuredHeight);
    }
    // const update  = { ...req.body, currentHeight:  };
    const bin = await Bin.findOneAndUpdate({ _id: req.params.id }, update, { new: true }).populate('assignedTo').lean().exec();
    if (!bin) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    if (update.currentHeight != null && alertSent == false) { // go to email and socketio only if there is an update in currentHeight
      const { currentHeight, maxHeight, assignedTo, location } = bin;
      if (currentHeight >= maxHeight && !alertSent) {
        const shortBinId = bin._id.toString().slice(-6).toUpperCase();
        const linkTxt1 = "Follow this link for more details: https://interactivewastebin.surge.sh"
        const smsMsg = `Hello ${assignedTo.name},\nBin ${shortBinId} is full.\nLocation: ${location}\nPlease empty it.\n${linkTxt1}\nRegards,\nInteractive WasteBin Team.`;
        sendSMS(assignedTo.phoneNo, smsMsg);
        
        const emailMsg = `<p>Hello, <strong>${assignedTo.name}</strong></p>
                    <p>Bin <strong>${shortBinId}</strong> is full.</>
                    <p>Location: ${location}</p>
                    <p>Please empty it.</p>
                    <p><a href="https://interactivewastebin.surge.sh" target="_blank">Follow this link for more details</a></p>
                    <p>Regards,</b></p>
                    <p><b>Interactive WasteBin Team.</b></p>`;
        const title = 'Bin Full';
        sendEmail(assignedTo.email, title, emailMsg);
        alertSent = true;
      }
      res.locals.sockdata = {
        binId: req.params.id, currentHeight, maxHeight, lat, lng
      };
      next();
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

function genEmailLinkTxt() {
  if (process.NODE_ENV != 'development') {
    return `<p><a href="https://interactivewastebin.surge.sh" target="_blank">Follow this link for more details</a></p>`
  }
  return ``;
}

exports.setBinEmptied = async (req, res, next) => {
  try {
    const update = { currentHeight: 0, lastEmptied: new Date().toISOString() }; // 2021-11-24T14:45:41.527+00:00
    // update.lastEmptied = new Date().toISOString();
    const result = await Bin.updateOne({ _id: req.params.id }, update).exec();
    if (result.n === 0) {
      res.status(404).json({ message: 'No bin matches that id' });
      return;
    }
    alertSent = false;
    res.sendStatus(201);
    // const msg = `<p>Bin ${update.bin_code} has been emptied.</>
    //             <p>Great work</p>
    //             <p>Regards, <b>PingBin Team</b></p>`;
    // sendEmail(req.headers.userid, 'Bin Emptied', msg);
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
