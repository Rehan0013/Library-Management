const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

router.get('/', movieController.getAllMovies);
router.post('/', movieController.addMovie);
router.put('/:id', movieController.updateMovie);

module.exports = router;
