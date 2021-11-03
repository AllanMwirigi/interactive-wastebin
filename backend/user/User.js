const mongoose = require('mongoose');

// specify attributes of a user and constraints on the attributes
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNo: { type: String, required: true },
  role: { type: String, required: true },
});

// this exports the defined User Model
module.exports = mongoose.model('User', userSchema);
