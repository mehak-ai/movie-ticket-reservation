const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET all movies
router.get('/', movieController.getAllMovies);

// GET single movie
router.get('/:id', movieController.getMovieById);

// GET showtimes for a movie
router.get('/:id/showtimes', movieController.getMovieShowtimes);

module.exports = router;