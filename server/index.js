require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const databaseService = require('./services/databaseService');

const app = express();
const PORT = process.env.PORT || 3001;

// Verify critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'ALPHA_VANTAGE_API_KEY', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    logger.error(`Missing required environment variable: ${varName}`);
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://financial-news-app-347q.onrender.com', 'https://jobly-backend-zp0b.onrender.com']
    : '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', authMiddleware, newsRoutes);

// Serve static files from client build
const clientDistPath = path.join(__dirname, 'public');
if (fs.existsSync(clientDistPath)) {
  logger.info('Serving static files from:', clientDistPath);
  app.use(express.static(clientDistPath));
  
  // Fallback for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  logger.warn('Client build directory not found:', clientDistPath);
}

// Error handling middleware
app.use(errorHandler);

// Database initialization with retry logic
async function initDB() {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      await databaseService.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
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
      logger.info('Database initialized successfully');
      return;
    } catch (err) {
      retryCount++;
      logger.error(`Database initialization attempt ${retryCount} failed:`, err);
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
      logger.info(`Server running on port ${PORT}`);
      logger.info('Current environment variables:', {
        NODE_ENV: process.env.NODE_ENV,
        DB_CONNECTED: true,
        API_KEY_SET: !!process.env.ALPHA_VANTAGE_API_KEY
      });
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer(); 