const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

// GET booked seats for a showtime
router.get('/:id/booked-seats', showtimeController.getBookedSeats);

// GET showtime details
router.get('/:id', showtimeController.getShowtimeById);

module.exports = router;