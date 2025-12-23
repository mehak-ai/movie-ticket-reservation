const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validateRequest');

// POST create booking
router.post('/', validateBooking, bookingController.createBooking);

// GET booking by reference
router.get('/:reference', bookingController.getBookingByReference);

// DELETE cancel booking
router.delete('/:reference', bookingController.cancelBooking);

module.exports = router;