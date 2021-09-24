
const mongoose = require('mongoose');

const { Schema } = mongoose;

const binSchema = new Schema({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  max_weight: { type: Number, required: true },
  min_height: { type: Number, required: true },
  current_weight: { type: Number, default: 0 }, // bin might be empty initially
  current_height: { type: Number, default: 0 },
  bin_code: { type: String, required: true, unique: true },
  lastEmptied: { type: Date },
  location: { type: String }
});

module.exports = mongoose.model('Bin', binSchema);
