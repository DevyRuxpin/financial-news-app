const express = require('express');
const morgan = require('morgan');
const { limiter, cors } = require('./middleware/securityMiddleware');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Security middleware
app.use(cors);
app.use(limiter);

// Logging middleware
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api', healthRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app; 