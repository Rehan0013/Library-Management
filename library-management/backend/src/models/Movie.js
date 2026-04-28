const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  director: { type: String, default: 'Unknown' },
  releaseDate: { type: Date },
  serialNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Available', 'Issued'], default: 'Available' },
  procurementDate: { type: Date, default: Date.now },
  cost: { type: Number, default: 0 },
});

module.exports = mongoose.model('Movie', movieSchema);
