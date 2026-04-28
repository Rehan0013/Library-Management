const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.get('/', transactionController.getTransactions);
router.get('/overdue', transactionController.getOverdueTransactions);
router.post('/issue', transactionController.issueItem);
router.post('/return', transactionController.returnItem);

module.exports = router;
