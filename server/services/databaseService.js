const { Pool } = require('pg');
const logger = require('../utils/logger');
const { pool } = require('../config/database');

class DatabaseService {
  constructor() {
    this.pool = null;
    this.initializePool();
  }

  initializePool() {
    const connectionString = this.getDatabaseUrl();
    this.pool = new Pool({
      connectionString,
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      maxUses: 7500,
      // Additional connection options
      application_name: 'news_app',
      statement_timeout: 60000, // 60 seconds
      query_timeout: 60000, // 60 seconds
      // Force non-SSL connection
      sslmode: 'disable'
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', () => {
      logger.debug('New client connected to the pool');
    });

    this.pool.on('remove', () => {
      logger.debug('Client removed from the pool');
    });
  }

  getDatabaseUrl() {
    if (process.env.NODE_ENV === 'test') {
      return process.env.DATABASE_URL || 'postgresql://marcharriman@localhost:5432/news_app_test';
    }
    return process.env.DATABASE_URL;
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Error executing query', { text, error });
      throw this.handleDatabaseError(error);
    }
  }

  handleDatabaseError(error) {
    // Map database errors to application-specific errors
    switch (error.code) {
      case '23505': // Unique violation
        return new Error('Duplicate entry');
      case '23503': // Foreign key violation
        return new Error('Referenced record not found');
      case '23502': // Not null violation
        return new Error('Required field missing');
      case '28P01': // Invalid password
        return new Error('Database authentication failed');
      case '3D000': // Database does not exist
        return new Error('Database not found');
      case '08001': // Connection error
        return new Error('Could not connect to database');
      case '08006': // Connection failure
        return new Error('Database connection failed');
      case '08004': // Connection rejected
        return new Error('Database connection rejected');
      case '08007': // Connection lost
        return new Error('Database connection lost');
      default:
        logger.error('Unhandled database error:', error);
        return new Error('Database operation failed');
    }
  }

  async close() {
    try {
      await this.pool.end();
      logger.info('Database pool closed successfully');
    } catch (error) {
      logger.error('Error closing database pool:', error);
      throw error;
    }
  }

  async checkConnection() {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      logger.error('Database connection check failed:', error);
      return false;
    }
  }

  async saveArticle(userId, article) {
    try {
      const query = `
        INSERT INTO saved_articles (
          user_id, 
          article_url, 
          article_title, 
          article_summary, 
          article_sentiment, 
          article_tickers
        ) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, article_url) DO NOTHING
        RETURNING id
      `;

      const values = [
        userId,
        article.url,
        article.title,
        article.summary,
        article.sentiment,
        article.tickers
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error saving article:', error);
      throw error;
    }
  }

  async getSavedArticles(userId) {
    try {
      const query = `
        SELECT 
          id,
          article_url as url,
          article_title as title,
          article_summary as summary,
          article_sentiment as sentiment,
          article_tickers as tickers,
          saved_at
        FROM saved_articles
        WHERE user_id = $1
        ORDER BY saved_at DESC
      `;

      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching saved articles:', error);
      throw error;
    }
  }

  async deleteSavedArticle(userId, articleUrl) {
    try {
      const query = `
        DELETE FROM saved_articles
        WHERE user_id = $1 AND article_url = $2
        RETURNING id
      `;

      const result = await pool.query(query, [userId, articleUrl]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error deleting saved article:', error);
      throw error;
    }
  }

  async isArticleSaved(userId, articleUrl) {
    try {
      const query = `
        SELECT id FROM saved_articles
        WHERE user_id = $1 AND article_url = $2
      `;

      const result = await pool.query(query, [userId, articleUrl]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking if article is saved:', error);
      throw error;
    }
  }
}

// Export a singleton instance
module.exports = new DatabaseService(); 