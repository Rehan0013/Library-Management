const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.get('/', bookController.getAllBooks);
router.post('/', bookController.addBook);
router.put('/:id', bookController.updateBook);

module.exports = router;
