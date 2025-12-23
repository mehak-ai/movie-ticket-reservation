const pool = require('../config/database');

class Booking {
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, m.title as movie_title, s.show_date, s.show_time 
         FROM bookings b
         JOIN showtimes s ON b.showtime_id = s.id
         JOIN movies m ON s.movie_id = m.id
         ORDER BY b.created_at DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, m.title as movie_title, s.show_date, s.show_time 
         FROM bookings b
         JOIN showtimes s ON b.showtime_id = s.id
         JOIN movies m ON s.movie_id = m.id
         WHERE b.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching booking: ${error.message}`);
    }
  }

  static async findByReference(reference) {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, m.title as movie_title, s.show_date, s.show_time 
         FROM bookings b
         JOIN showtimes s ON b.showtime_id = s.id
         JOIN movies m ON s.movie_id = m.id
         WHERE b.booking_reference = ?`,
        [reference]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching booking by reference: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, m.title as movie_title, s.show_date, s.show_time 
         FROM bookings b
         JOIN showtimes s ON b.showtime_id = s.id
         JOIN movies m ON s.movie_id = m.id
         WHERE b.customer_email = ?
         ORDER BY b.created_at DESC`,
        [email]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching bookings by email: ${error.message}`);
    }
  }

  static async findByShowtime(showtimeId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM bookings 
         WHERE showtime_id = ? AND status = 'confirmed'
         ORDER BY created_at DESC`,
        [showtimeId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching bookings for showtime: ${error.message}`);
    }
  }

  static async create(bookingData) {
    const { showtime_id, customer_name, customer_email, customer_phone, seats, total_amount } = bookingData;
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
      
      const [bookedSeatsRows] = await connection.query(
        `SELECT s.seat_number 
         FROM seats s 
         JOIN bookings b ON s.booking_id = b.id 
         WHERE b.showtime_id = ? AND b.status = 'confirmed'
         FOR UPDATE`,
        [showtime_id]
      );
      
      const bookedSeats = bookedSeatsRows.map(r => r.seat_number);
      const conflictingSeats = seats.filter(seat => bookedSeats.includes(seat));
      
      if (conflictingSeats.length > 0) {
        throw new Error(`Seats already booked: ${conflictingSeats.join(', ')}`);
      }
      
      const booking_reference = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
      
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings 
         (showtime_id, customer_name, customer_email, customer_phone, seats, total_amount, booking_reference) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [showtime_id, customer_name, customer_email, customer_phone, JSON.stringify(seats), total_amount, booking_reference]
      );
      
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
      
      return {
        id: bookingId,
        booking_reference,
        ...bookingData
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async cancel(reference) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const [bookingRows] = await connection.query(
        'SELECT * FROM bookings WHERE booking_reference = ? FOR UPDATE',
        [reference]
      );
      
      if (bookingRows.length === 0) {
        throw new Error('Booking not found');
      }
      
      const booking = bookingRows[0];
      
      if (booking.status === 'cancelled') {
        throw new Error('Booking already cancelled');
      }
      
      const seats = JSON.parse(booking.seats);
      
      await connection.query(
        'UPDATE bookings SET status = ? WHERE id = ?',
        ['cancelled', booking.id]
      );
      
      await connection.query(
        'UPDATE showtimes SET available_seats = available_seats + ? WHERE id = ?',
        [seats.length, booking.showtime_id]
      );
      
      await connection.commit();
      
      return true;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getStatistics() {
    try {
      const [stats] = await pool.query(
        `SELECT 
           COUNT(*) as total_bookings,
           COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
           COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
           SUM(CASE WHEN status = 'confirmed' THEN total_amount ELSE 0 END) as total_revenue,
           AVG(CASE WHEN status = 'confirmed' THEN total_amount ELSE NULL END) as average_booking_value
         FROM bookings`
      );
      
      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching booking statistics: ${error.message}`);
    }
  }

  static async findRecent(limit = 10) {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, m.title as movie_title, s.show_date, s.show_time 
         FROM bookings b
         JOIN showtimes s ON b.showtime_id = s.id
         JOIN movies m ON s.movie_id = m.id
         WHERE b.status = 'confirmed'
         ORDER BY b.created_at DESC
         LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching recent bookings: ${error.message}`);
    }
  }

  static async getSeats(bookingId) {
    try {
      const [rows] = await pool.query(
        'SELECT seat_number FROM seats WHERE booking_id = ?',
        [bookingId]
      );
      
      return rows.map(row => row.seat_number);
    } catch (error) {
      throw new Error(`Error fetching booking seats: ${error.message}`);
    }
  }

  static async exists(reference) {
    try {
      const [rows] = await pool.query(
        'SELECT id FROM bookings WHERE booking_reference = ?',
        [reference]
      );
      
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking booking existence: ${error.message}`);
    }
  }
}

module.exports = Booking;
