const axios = require('axios');
const { pool } = require('../models/db');

const getNews = async (req, res) => {
  try {
    const { tickers, topics, time_from, sort, limit } = req.query;
    const params = {
      function: 'NEWS_SENTIMENT',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
      ...(tickers && { tickers }),
      ...(topics && { topics }),
      ...(time_from && { time_from }),
      ...(sort && { sort }),
      ...(limit && { limit })
    };
    
    const response = await axios.get('https://www.alphavantage.co/query', { params });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

const saveArticle = async (req, res) => {
  const { user_id, article_id } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO saved_articles (user_id, article_id) VALUES ($1, $2)',
      [user_id, article_id]
    );
    res.json({ message: 'Article saved' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to save article' });
  }
};

const getSavedArticles = async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM saved_articles WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved articles' });
  }
};

module.exports = { getNews, saveArticle, getSavedArticles };
