const { body, validationResult } = require('express-validator');

exports.validateBooking = [
  body('showtime_id').isInt().withMessage('Valid showtime ID is required'),
  body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer_email').isEmail().withMessage('Valid email is required'),
  body('customer_phone').trim().notEmpty().withMessage('Phone number is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat must be selected'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Valid total amount is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];