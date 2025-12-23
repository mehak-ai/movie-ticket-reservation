const pool = require('../config/database');

exports.createBooking = async (req, res, next) => {
  const { showtime_id, customer_name, customer_email, customer_phone, seats, total_amount } = req.body;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [showtimeRows] = await connection.query(
      'SELECT available_seats FROM showtimes WHERE id = ? FOR UPDATE',
      [showtime_id]
    );
    
    if (showtimeRows.length === 0) {
      throw new Error('Showtime not found');
    }
    
    const availableSeats = showtimeRows[0].available_seats;
    
    if (availableSeats < seats.length) {
      throw new Error(`Only ${availableSeats} seats available`);
    }
    
    const [bookedSeatsRows] = await connection.query(`
      SELECT s.seat_number 
      FROM seats s 
      JOIN bookings b ON s.booking_id = b.id 
      WHERE b.showtime_id = ?
      FOR UPDATE
    `, [showtime_id]);
    
    const bookedSeats = bookedSeatsRows.map(r => r.seat_number);
    const conflictingSeats = seats.filter(seat => bookedSeats.includes(seat));
    
    if (conflictingSeats.length > 0) {
      throw new Error(`Seats already booked: ${conflictingSeats.join(', ')}`);
    }
    
    const booking_reference = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
    
    const [bookingResult] = await connection.query(`
      INSERT INTO bookings 
      (showtime_id, customer_name, customer_email, customer_phone, seats, total_amount, booking_reference) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [showtime_id, customer_name, customer_email, customer_phone, JSON.stringify(seats), total_amount, booking_reference]);
    
    const bookingId = bookingResult.insertId;
    
    const seatValues = seats.map(seat => [bookingId, seat]);
    await connection.query(
      'INSERT INTO seats (booking_id, seat_number) VALUES ?',
      [seatValues]
    );
    
    await connection.query(
      'UPDATE showtimes SET available_seats = available_seats - ? WHERE id = ?',
      [seats.length, showtime_id]
    );
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      booking_reference,
      booking_id: bookingId,
      message: 'Booking confirmed successfully'
    });
    
  } catch (error) {
    await connection.rollback();
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    connection.release();
  }
};

exports.getBookingByReference = async (req, res, next) => {
  try {
    const [results] = await pool.query(`
      SELECT b.*, m.title, s.show_date, s.show_time 
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      WHERE b.booking_reference = ?
    `, [req.params.reference]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(results[0]);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [bookingRows] = await connection.query(
      'SELECT * FROM bookings WHERE booking_reference = ? FOR UPDATE',
      [req.params.reference]
    );
    
    if (bookingRows.length === 0) {
      throw new Error('Booking not found');
    }
    
    const booking = bookingRows[0];
    const seats = JSON.parse(booking.seats);
    
    await connection.query('DELETE FROM seats WHERE booking_id = ?', [booking.id]);
    await connection.query('DELETE FROM bookings WHERE id = ?', [booking.id]);
    
    await connection.query(
      'UPDATE showtimes SET available_seats = available_seats + ? WHERE id = ?',
      [seats.length, booking.showtime_id]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
    
  } catch (error) {
    await connection.rollback();
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    connection.release();
  }
};
