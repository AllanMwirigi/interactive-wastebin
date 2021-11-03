
const mongoose = require('mongoose');

const { Schema } = mongoose;

const binSchema = new Schema({
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  location: { type: String, required: true },
  maxHeight: { type: Number }, // by default will be 90% of height
  currentHeight: { type: Number, default: 0 },
  lastEmptied: { type: Date, default: null },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  lat: { type: Number },
  lng: { type: Number },
});

module.exports = mongoose.model('Bin', binSchema);
