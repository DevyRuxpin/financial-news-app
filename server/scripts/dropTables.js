const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function dropTables() {
  try {
    // Drop tables in correct order to handle foreign key constraints
    await pool.query(`
      DROP TABLE IF EXISTS saved_articles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await pool.end();
  }
}

dropTables(); 