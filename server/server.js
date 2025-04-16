// Load environment variables first with error handling
try {
  require('dotenv').config({ path: '../.env' }); // Look for .env in project root
  console.log('Environment variables loaded');
} catch (err) {
  console.warn('Failed to load .env file. Using Render environment variables:', err.message);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const { pool } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Verify critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'ALPHA_VANTAGE_API_KEY', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// Fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Database initialization with retry logic
async function initDB() {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
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
      console.log('Database initialized successfully');
      return;
    } catch (err) {
      retryCount++;
      console.error(`Database initialization attempt ${retryCount} failed:`, err);
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  throw new Error('Database initialization failed after multiple attempts');
}

// Start server with error handling
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Current environment variables:', {
        NODE_ENV: process.env.NODE_ENV,
        DB_CONNECTED: !!pool,
        API_KEY_SET: !!process.env.ALPHA_VANTAGE_API_KEY
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
