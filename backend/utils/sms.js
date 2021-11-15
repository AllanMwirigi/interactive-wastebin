const AfricasTalking = require('africastalking');
const logger = require('./winston');

// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY, 
  username: process.env.AT_USERNAME,
});

exports.sendSMS = async (phoneNo, msg) => {
  // phoneNo format: '+254....'
  try {
    const result = await africastalking.SMS.send({
      to: phoneNo, 
      message: msg,
      // from: process.env.AT_SMS_SHORTCODE,
    });
  } catch(err) {
    // console.error(ex);
    logger.error(`SMS | ${err.message}`);
  }

};