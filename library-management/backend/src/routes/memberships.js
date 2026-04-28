const express = require('express');
const membershipController = require('../controllers/membershipController');
const router = express.Router();

router.get('/', membershipController.getAllMemberships);
router.post('/', membershipController.addMembership);
router.put('/:id', membershipController.updateMembership);

module.exports = router;
