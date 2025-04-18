const axios = require('axios');
const { pool } = require('../models/db');

// Mock data for testing
const mockData = {
  feed: [
    {
      title: "Market Analysis: Tech Stocks Show Strong Growth",
      summary: "Major tech companies reported better-than-expected earnings, leading to a surge in stock prices.",
      time_published: "20240416T143000",
      authors: ["John Smith", "Jane Doe"],
      url: "https://example.com/article1",
      overall_sentiment_label: "Bullish",
      ticker_sentiment: [
        { ticker: "AAPL", ticker_sentiment_label: "Bullish" },
        { ticker: "MSFT", ticker_sentiment_label: "Somewhat-Bullish" }
      ]
    },
    {
      title: "Federal Reserve Announces Interest Rate Decision",
      summary: "The Federal Reserve has decided to maintain current interest rates, citing stable economic indicators.",
      time_published: "20240416T140000",
      authors: ["Robert Johnson"],
      url: "https://example.com/article2",
      overall_sentiment_label: "Neutral",
      ticker_sentiment: [
        { ticker: "JPM", ticker_sentiment_label: "Neutral" },
        { ticker: "BAC", ticker_sentiment_label: "Neutral" }
      ]
    },
    {
      title: "Energy Sector Faces Challenges Amid Market Volatility",
      summary: "Oil prices fluctuate as geopolitical tensions impact global energy markets.",
      time_published: "20240416T133000",
      authors: ["Sarah Williams"],
      url: "https://example.com/article3",
      overall_sentiment_label: "Bearish",
      ticker_sentiment: [
        { ticker: "XOM", ticker_sentiment_label: "Bearish" },
        { ticker: "CVX", ticker_sentiment_label: "Somewhat-Bearish" }
      ]
    }
  ],
  items: 3
};

const getNews = async (req, res) => {
  try {
    const { useMock } = req.query;
    
    // If useMock is true, return mock data immediately
    if (useMock === 'true') {
      console.log('Using mock data');
      return res.json(mockData);
    }

    const { tickers, topics, time_from, sort, limit } = req.query;
    console.log('Received request with params:', { tickers, topics, time_from, sort, limit });
    
    // Check if API key is available
    if (!process.env.ALPHA_VANTAGE_API_KEY) {
      console.error('ALPHA_VANTAGE_API_KEY is not set');
      return res.json(mockData); // Return mock data if API key is not set
    }
    
    // Default parameters for initial load
    const defaultParams = {
      function: 'NEWS_SENTIMENT',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
      limit: '5',
      sort: 'LATEST',
      topics: 'financial_markets'  // Default topic for financial news
    };

    // If no search parameters provided, use default parameters
    const params = Object.keys(req.query).length === 0 
      ? defaultParams 
      : {
          ...defaultParams,
          ...(tickers && { tickers: tickers.toUpperCase() }),  // Convert tickers to uppercase
          ...(topics && { topics }),
          ...(time_from && { time_from }),
          ...(sort && { sort }),
          ...(limit && { limit })
        };
    
    console.log('Making API request with params:', { ...params, apikey: '[REDACTED]' });
    
    // Add timeout and retry logic
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', { 
          params,
          timeout: 10000 // 10 second timeout
        });
        
        console.log('Alpha Vantage API response:', response.data);
        
        if (response.data.Note) {
          console.error('API rate limit note:', response.data.Note);
          return res.json(mockData); // Return mock data on rate limit
        }

        if (!response.data.feed) {
          console.error('No feed data in response:', response.data);
          return res.json(mockData); // Return mock data if no feed data
        }
        
        // Format the response data
        const formattedData = {
          feed: response.data.feed.map(article => ({
            ...article,
            time_published: new Date(article.time_published).toISOString(),
            overall_sentiment_label: article.overall_sentiment_label || 'Neutral',
            title: article.title || 'No title available',
            summary: article.summary || 'No summary available',
            url: article.url || '#',
            authors: article.authors || [],
            ticker_sentiment: article.ticker_sentiment || []
          })),
          items: response.data.items || 0
        };
        
        console.log('Sending formatted response with', formattedData.feed.length, 'articles');
        return res.json(formattedData);
      } catch (err) {
        lastError = err;
        retryCount++;
        console.error(`Attempt ${retryCount} failed:`, err.message);
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        }
      }
    }

    // If we get here, all retries failed - return mock data
    console.error('All retries failed, returning mock data');
    return res.json(mockData);
  } catch (err) {
    console.error('News fetch error:', {
      message: err.message,
      response: err.response?.data,
      stack: err.stack
    });
    // On any error, return mock data
    return res.json(mockData);
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
