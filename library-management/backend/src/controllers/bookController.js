const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const { name, author } = req.query;
    let query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (author) query.author = new RegExp(author, 'i');
    
    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
