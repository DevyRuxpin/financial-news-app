const { Pool } = require('pg');

const pool = new Pool({
  user: 'marcharriman',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

async function setupTestDatabase() {
  try {
    // Drop the test database if it exists
    await pool.query('DROP DATABASE IF EXISTS news_app_test');
    
    // Create a new test database
    await pool.query('CREATE DATABASE news_app_test');
    
    console.log('Test database setup completed successfully');
  } catch (error) {
    console.error('Error setting up test database:', error);
  } finally {
    await pool.end();
  }
}

setupTestDatabase(); 