const { Pool } = require('pg');

const pool = new Pool({
  user: 'marcharriman',
  host: 'localhost',
  port: 5432,
  database: 'news_app_test'
});

async function setupTestSchema() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create saved_articles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_articles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        source VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Test database schema setup completed successfully');
  } catch (error) {
    console.error('Error setting up test database schema:', error);
  } finally {
    await pool.end();
  }
}

setupTestSchema(); 