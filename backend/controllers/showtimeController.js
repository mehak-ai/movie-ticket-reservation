const pool = require('../config/database');

exports.getShowtimeById = async (req, res, next) => {
  try {
    const [showtimes] = await pool.query(
      'SELECT * FROM showtimes WHERE id = ?',
      [req.params.id]
    );
    
    if (showtimes.length === 0) {
      return res.status(404).json({ error: 'Showtime not found' });
    }
    
    res.json(showtimes[0]);
  } catch (error) {
    next(error);
  }
};

exports.getBookedSeats = async (req, res, next) => {
  try {
    const [seats] = await pool.query(`
      SELECT s.seat_number 
      FROM seats s 
      JOIN bookings b ON s.booking_id = b.id 
      WHERE b.showtime_id = ?
    `, [req.params.id]);
    
    res.json(seats.map(s => s.seat_number));
  } catch (error) {
    next(error);
  }
};