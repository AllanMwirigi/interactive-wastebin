const mongoose = require('mongoose');

// specify attributes of a user and constraints on the attributes
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phoneNo: { type: String }
});

// this exports the defined User Model
module.exports = mongoose.model('User', userSchema);
