const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Movie = require('../models/Movie');

exports.getTransactions = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const transactions = await Transaction.find(query)
      .populate('book')
      .populate('movie')
      .populate('membership');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOverdueTransactions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const transactions = await Transaction.find({
      status: 'Issued',
      returnDate: { $lt: today }
    })
    .populate('book')
    .populate('movie')
    .populate('membership');
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.issueItem = async (req, res) => {
  try {
    const { bookId, movieId, membershipId, issueDate, returnDate, remarks } = req.body;
    
    const newTx = new Transaction({
      book: bookId || undefined,
      movie: movieId || undefined,
      membership: membershipId,
      issueDate,
      returnDate,
      remarks,
      status: 'Issued'
    });
    await newTx.save();
    
    if (bookId) {
      await Book.findByIdAndUpdate(bookId, { status: 'Issued' });
    } else if (movieId) {
      await Movie.findByIdAndUpdate(movieId, { status: 'Issued' });
    }
    
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.returnItem = async (req, res) => {
  try {
    const { serialNumber, actualReturnDate, remarks, finePaid } = req.body;
    
    let item = await Book.findOne({ serialNumber: { $regex: new RegExp(`^${serialNumber}$`, 'i') } });
    let itemType = 'book';
    
    if (!item) {
      item = await Movie.findOne({ serialNumber: { $regex: new RegExp(`^${serialNumber}$`, 'i') } });
      itemType = 'movie';
    }
    
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    let txQuery = { status: 'Issued' };
    if (itemType === 'book') txQuery.book = item._id;
    else txQuery.movie = item._id;
    
    const tx = await Transaction.findOne(txQuery);
    if (!tx) return res.status(404).json({ message: 'No active issue found for this item' });

    const retDate = new Date(tx.returnDate);
    retDate.setHours(0, 0, 0, 0);
    const actRetDate = new Date(actualReturnDate);
    actRetDate.setHours(0, 0, 0, 0);
    
    let fine = 0;
    if (actRetDate > retDate) {
      const diffTime = actRetDate - retDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      fine = diffDays * 50; 
    }

    if (fine > 0 && !finePaid) {
      return res.status(400).json({ 
        message: 'Fine must be paid before returning',
        fineCalculated: fine,
        transactionId: tx._id
      });
    }

    tx.actualReturnDate = actualReturnDate;
    tx.remarks = remarks;
    tx.fineCalculated = fine;
    tx.finePaid = fine > 0 ? true : false;
    tx.status = 'Returned';
    await tx.save();

    if (itemType === 'book') {
      await Book.findByIdAndUpdate(item._id, { status: 'Available' });
    } else {
      await Movie.findByIdAndUpdate(item._id, { status: 'Available' });
    }

    res.json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
