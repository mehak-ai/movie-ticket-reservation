const pool = require('../config/database');

class Showtime {
  // Get all showtimes
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, m.title as movie_title 
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.id
         ORDER BY s.show_date ASC, s.show_time ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching showtimes: ${error.message}`);
    }
  }

  // Get showtime by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, m.title as movie_title 
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.id
         WHERE s.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching showtime: ${error.message}`);
    }
  }

  // Get showtimes by movie ID
  static async findByMovieId(movieId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM showtimes 
         WHERE movie_id = ? 
         ORDER BY show_date ASC, show_time ASC`,
        [movieId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching showtimes for movie: ${error.message}`);
    }
  }

  // Get showtimes by date
  static async findByDate(date) {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, m.title as movie_title 
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.id
         WHERE s.show_date = ?
         ORDER BY s.show_time ASC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching showtimes by date: ${error.message}`);
    }
  }

  // Create new showtime
  static async create(showtimeData) {
    const { movie_id, show_date, show_time, available_seats = 80 } = showtimeData;
    
    try {
      const [result] = await pool.query(
        `INSERT INTO showtimes (movie_id, show_date, show_time, available_seats) 
         VALUES (?, ?, ?, ?)`,
        [movie_id, show_date, show_time, available_seats]
      );
      
      return {
        id: result.insertId,
        ...showtimeData
      };
    } catch (error) {
      throw new Error(`Error creating showtime: ${error.message}`);
    }
  }

  // Update showtime
  static async update(id, showtimeData) {
    const { movie_id, show_date, show_time, available_seats } = showtimeData;
    
    try {
      const [result] = await pool.query(
        `UPDATE showtimes 
         SET movie_id = ?, show_date = ?, show_time = ?, available_seats = ?
         WHERE id = ?`,
        [movie_id, show_date, show_time, available_seats, id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating showtime: ${error.message}`);
    }
  }

  // Delete showtime
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM showtimes WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting showtime: ${error.message}`);
    }
  }

  // Get booked seats for a showtime
  static async getBookedSeats(showtimeId) {
    try {
      const [rows] = await pool.query(
        `SELECT s.seat_number 
         FROM seats s 
         JOIN bookings b ON s.booking_id = b.id 
         WHERE b.showtime_id = ? AND b.status = 'confirmed'`,
        [showtimeId]
      );
      
      return rows.map(row => row.seat_number);
    } catch (error) {
      throw new Error(`Error fetching booked seats: ${error.message}`);
    }
  }

  // Update available seats (with transaction lock)
  static async updateAvailableSeats(connection, showtimeId, seatsToDeduct) {
    try {
      const [result] = await connection.query(
        `UPDATE showtimes 
         SET available_seats = available_seats - ? 
         WHERE id = ? AND available_seats >= ?`,
        [seatsToDeduct, showtimeId, seatsToDeduct]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Not enough seats available');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Error updating available seats: ${error.message}`);
    }
  }

  // Restore available seats (for cancellations)
  static async restoreAvailableSeats(connection, showtimeId, seatsToRestore) {
    try {
      await connection.query(
        `UPDATE showtimes 
         SET available_seats = available_seats + ? 
         WHERE id = ?`,
        [seatsToRestore, showtimeId]
      );
      
      return true;
    } catch (error) {
      throw new Error(`Error restoring available seats: ${error.message}`);
    }
  }

  // Get available showtimes (with available seats > 0)
  static async findAvailable() {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, m.title as movie_title 
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.id
         WHERE s.available_seats > 0 
         AND s.show_date >= CURDATE()
         ORDER BY s.show_date ASC, s.show_time ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching available showtimes: ${error.message}`);
    }
  }

  // Get showtimes for today
  static async findToday() {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, m.title as movie_title 
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.id
         WHERE s.show_date = CURDATE()
         ORDER BY s.show_time ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching today's showtimes: ${error.message}`);
    }
  }

  // Get upcoming showtimes
  static async findUpcoming(days = 7) {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, m.title as movie_title 
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.id
         WHERE s.show_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
         ORDER BY s.show_date ASC, s.show_time ASC`,
        [days]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching upcoming showtimes: ${error.message}`);
    }
  }

  // Check if showtime is fully booked
  static async isFullyBooked(showtimeId) {
    try {
      const [rows] = await pool.query(
        'SELECT available_seats FROM showtimes WHERE id = ?',
        [showtimeId]
      );
      
      if (rows.length === 0) {
        throw new Error('Showtime not found');
      }
      
      return rows[0].available_seats === 0;
    } catch (error) {
      throw new Error(`Error checking showtime availability: ${error.message}`);
    }
  }
}

module.exports = Showtime;