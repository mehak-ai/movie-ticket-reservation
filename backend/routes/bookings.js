const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validateRequest');

router.post('/', validateBooking, bookingController.createBooking);

router.get('/:reference', bookingController.getBookingByReference);

router.delete('/:reference', bookingController.cancelBooking);

module.exports = router;
