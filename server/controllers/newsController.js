const axios = require('axios');
const { pool } = require('../models/db');

const getNews = async (req, res) => {
  try {
    const { tickers, topics, time_from, sort, limit } = req.query;
    console.log('Received request with params:', { tickers, topics, time_from, sort, limit });
    
    // Default parameters for initial load
    const defaultParams = {
      function: 'NEWS_SENTIMENT',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
      limit: '5',
      sort: 'LATEST'
    };

    // If no search parameters provided, use default parameters
    const params = Object.keys(req.query).length === 0 
      ? defaultParams 
      : {
          ...defaultParams,
          ...(tickers && { tickers }),
          ...(topics && { topics }),
          ...(time_from && { time_from }),
          ...(sort && { sort }),
          ...(limit && { limit })
        };
    
    console.log('Making API request with params:', params);
    const response = await axios.get('https://www.alphavantage.co/query', { params });
    console.log('Alpha Vantage API response:', response.data);
    
    // Format the response data
    const formattedData = {
      feed: response.data.feed?.map(article => ({
        ...article,
        time_published: new Date(article.time_published).toISOString(),
        overall_sentiment_label: article.overall_sentiment_label || 'Neutral',
        title: article.title || 'No title available',
        summary: article.summary || 'No summary available',
        url: article.url || '#',
        authors: article.authors || [],
        ticker_sentiment: article.ticker_sentiment || []
      })) || [],
      items: response.data.items || 0
    };
    
    console.log('Sending formatted response:', formattedData);
    res.json(formattedData);
  } catch (err) {
    console.error('News fetch error:', err.response?.data || err.message);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      details: err.response?.data || err.message
    });
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

const deleteSavedArticle = async (req, res) => {
  const { article_id } = req.params;
  const user_id = req.user.userId;
  
  try {
    await pool.query(
      'DELETE FROM saved_articles WHERE user_id = $1 AND article_id = $2',
      [user_id, article_id]
    );
    res.json({ message: 'Article removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove article' });
  }
};

module.exports = { getNews, saveArticle, getSavedArticles, deleteSavedArticle };
