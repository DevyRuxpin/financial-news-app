const { Pool } = require('pg');

const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.DATABASE_URL || 'postgresql://marcharriman@localhost:5432/news_app_test';
  }
  return process.env.DATABASE_URL;
};

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = { pool };
