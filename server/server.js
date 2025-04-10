require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const { pool } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Financial News API');
});

// Initialize database
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS saved_articles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        article_id VARCHAR(255) NOT NULL,
        saved_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, article_id)
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

app.listen(PORT, async () => {
  await initDB();
  console.log(`Server running on port ${PORT}`);
});
