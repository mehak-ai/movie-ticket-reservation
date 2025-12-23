const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL');

    const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schema);
    console.log('✓ Database schema created');

    const seed = await fs.readFile(path.join(__dirname, 'seed.sql'), 'utf8');
    await connection.query(seed);
    console.log('✓ Sample data inserted');

    const indexes = await fs.readFile(path.join(__dirname, 'indexes.sql'), 'utf8');
    await connection.query(indexes);
    console.log('✓ Indexes created');

    await connection.end();
    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
