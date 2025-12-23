const pool = require('../config/database');

exports.getAllMovies = async (req, res, next) => {
  try {
    const [movies] = await pool.query('SELECT * FROM movies ORDER BY title');
    
    for (let movie of movies) {
      const [showtimes] = await pool.query(
        'SELECT * FROM showtimes WHERE movie_id = ? ORDER BY show_date, show_time',
        [movie.id]
      );
      movie.showtimes = showtimes;
    }
    
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const [movies] = await pool.query(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );
    
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movies[0]);
  } catch (error) {
    next(error);
  }
};

exports.getMovieShowtimes = async (req, res, next) => {
  try {
    const [showtimes] = await pool.query(
      'SELECT * FROM showtimes WHERE movie_id = ? ORDER BY show_date, show_time',
      [req.params.id]
    );
    
    res.json(showtimes);
  } catch (error) {
    next(error);
  }
};
