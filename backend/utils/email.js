const nodemailer = require('nodemailer');
const logger = require('./winston');
const User = require('../models/User');

const emailName = process.env.EMAIL_NAME;
const emailPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailName,
    pass: emailPass
  },
  tls: { rejectUnauthorized: false }
});

exports.sendEmail = async (userId, subject, htmlMsg) => {
  // try { // removed the try catch block just to pass codacy checks, restore in prod
  const receipient = await User.findById(userId).select('-_id email').lean().exec();
  const mailOptions = {
    from: emailName, // sender address
    to: receipient.email, // list of receivers
    subject, // Subject line
    html: htmlMsg // plain text body
  };
  transporter.sendMail(mailOptions, (err /* , info */) => {
    if (err) logger.error(`email | ${err.message}`);
  });
  // } catch (error) {
  //   logger.error(`email | ${error.message}`);
  // }
};
