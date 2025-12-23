const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'movie_booking',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✓ MySQL Connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('✗ Error connecting to MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;
