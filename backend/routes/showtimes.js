const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.get('/:id/booked-seats', showtimeController.getBookedSeats);

router.get('/:id', showtimeController.getShowtimeById);

module.exports = router;
