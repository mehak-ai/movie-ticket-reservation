const pool = require('../config/database');

class Movie {
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM movies ORDER BY title ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM movies WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }

  static async create(movieData) {
    const { title, genre, duration, rating, poster, description } = movieData;
    
    try {
      const [result] = await pool.query(
        `INSERT INTO movies (title, genre, duration, rating, poster, description) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, genre, duration, rating, poster, description]
      );
      
      return {
        id: result.insertId,
        ...movieData
      };
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  static async update(id, movieData) {
    const { title, genre, duration, rating, poster, description } = movieData;
    
    try {
      const [result] = await pool.query(
        `UPDATE movies 
         SET title = ?, genre = ?, duration = ?, rating = ?, poster = ?, description = ?
         WHERE id = ?`,
        [title, genre, duration, rating, poster, description, id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM movies WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }

  static async findAllWithShowtimes() {
    try {
      const movies = await this.findAll();
      
      for (let movie of movies) {
        const [showtimes] = await pool.query(
          `SELECT * FROM showtimes 
           WHERE movie_id = ? 
           ORDER BY show_date ASC, show_time ASC`,
          [movie.id]
        );
        movie.showtimes = showtimes;
      }
      
      return movies;
    } catch (error) {
      throw new Error(`Error fetching movies with showtimes: ${error.message}`);
    }
  }

  static async search(searchTerm) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM movies 
         WHERE title LIKE ? OR genre LIKE ?
         ORDER BY title ASC`,
        [`%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }

  static async findByGenre(genre) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM movies WHERE genre LIKE ? ORDER BY title ASC',
        [`%${genre}%`]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching movies by genre: ${error.message}`);
    }
  }

  static async findByRating(rating) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM movies WHERE rating = ? ORDER BY title ASC',
        [rating]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching movies by rating: ${error.message}`);
    }
  }
}

module.exports = Movie;
