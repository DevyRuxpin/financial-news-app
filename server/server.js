// Load environment variables first with error handling
try {
  require('dotenv').config();
  console.log('Environment variables loaded');
} catch (err) {
  console.warn('Failed to load .env file. Using Render environment variables:', err.message);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { pool, checkConnection, close } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Verify critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'ALPHA_VANTAGE_API_KEY', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    logger.error(`Missing required environment variable: ${varName}`);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', authMiddleware, newsRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbConnected = await checkConnection();
  res.json({
    status: dbConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await close();
  process.exit(0);
});

// Start server with error handling
async function startServer() {
  try {
    // Check database connection
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

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
