const { Pool } = require('pg');
const logger = require('../utils/logger');

// Get database URL from environment
const getDatabaseUrl = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    return process.env.DATABASE_URL;
};

// Create a new pool with optimized settings for Render
const pool = new Pool({
    connectionString: getDatabaseUrl(),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    connectionTimeoutMillis: 10000, // How long to wait for a connection
    maxUses: 7500, // Maximum number of times a client can be used
    application_name: 'financial_news_app',
    statement_timeout: 60000, // 60 seconds
    query_timeout: 60000 // 60 seconds
});

// Pool event handlers
pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
    logger.debug('New client connected to the pool');
});

pool.on('remove', () => {
    logger.debug('Client removed from the pool');
});

// Health check function
const checkConnection = async () => {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch (error) {
        logger.error('Database connection check failed:', error);
        return false;
    }
};

// Graceful shutdown
const close = async () => {
    try {
        await pool.end();
        logger.info('Database pool closed successfully');
    } catch (error) {
        logger.error('Error closing database pool:', error);
        throw error;
    }
};

module.exports = {
    pool,
    checkConnection,
    close
}; 