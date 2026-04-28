const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  actualReturnDate: { type: Date },
  fineCalculated: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  remarks: { type: String }
});

module.exports = mongoose.model('Transaction', transactionSchema);
