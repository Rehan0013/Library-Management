const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  membershipNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNo: { type: String, required: true },
  contactAddress: { type: String, required: true },
  aadhar: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  membershipType: { type: String, enum: ['six_months', 'one_year', 'two_years'], default: 'six_months' },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Membership', membershipSchema);
