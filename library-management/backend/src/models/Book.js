const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, default: 'Unknown' },
  serialNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Available', 'Issued'], default: 'Available' },
  procurementDate: { type: Date, default: Date.now },
  cost: { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', bookSchema);
