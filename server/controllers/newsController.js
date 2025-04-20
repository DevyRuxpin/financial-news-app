const axios = require('axios');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

// Cache implementation
const cache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  isRateLimited: false,
  rateLimitResetTime: null
};

// Enhanced mock data with more variety
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
    },
    {
      title: "Cryptocurrency Market Shows Signs of Recovery",
      summary: "Bitcoin and Ethereum show strong recovery after recent market correction.",
      time_published: "20240416T130000",
      authors: ["Michael Chen"],
      url: "https://example.com/article4",
      overall_sentiment_label: "Somewhat-Bullish",
      ticker_sentiment: [
        { ticker: "BTC", ticker_sentiment_label: "Bullish" },
        { ticker: "ETH", ticker_sentiment_label: "Somewhat-Bullish" }
      ]
    },
    {
      title: "Retail Sector Faces Headwinds",
      summary: "Major retailers report declining sales amid changing consumer behavior.",
      time_published: "20240416T120000",
      authors: ["Emily Brown"],
      url: "https://example.com/article5",
      overall_sentiment_label: "Somewhat-Bearish",
      ticker_sentiment: [
        { ticker: "WMT", ticker_sentiment_label: "Neutral" },
        { ticker: "TGT", ticker_sentiment_label: "Bearish" }
      ]
    }
  ],
  items: 5
};

// Helper function to check if cache is valid
const isCacheValid = () => {
  if (!cache.data || !cache.timestamp) return false;
  if (cache.isRateLimited && cache.rateLimitResetTime > Date.now()) return true;
  return Date.now() - cache.timestamp < cache.CACHE_DURATION;
};

// Helper function to format API response
const formatNewsData = (data) => ({
  feed: data.feed.map(article => ({
    ...article,
    time_published: new Date(article.time_published).toISOString(),
    overall_sentiment_label: article.overall_sentiment_label || 'Neutral',
    title: article.title || 'No title available',
    summary: article.summary || 'No summary available',
    url: article.url || '#',
    authors: article.authors || [],
    ticker_sentiment: article.ticker_sentiment || []
  })),
  items: data.items || 0
});

const getNews = async (req, res) => {
  try {
    const { useMock, forceRefresh } = req.query;
    
    // If useMock is true, return mock data immediately
    if (useMock === 'true') {
      console.log('Using mock data as requested');
      return res.json(mockData);
    }

    // Check cache first if not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      console.log('Returning cached data');
      return res.json(cache.data);
    }

    const { tickers, topics, time_from, sort, limit } = req.query;
    console.log('Received request with params:', { tickers, topics, time_from, sort, limit });
    
    // Check if API key is available
    if (!process.env.ALPHA_VANTAGE_API_KEY) {
      console.error('ALPHA_VANTAGE_API_KEY is not set');
      return res.json(mockData);
    }
    
    // Default parameters for initial load
    const defaultParams = {
      function: 'NEWS_SENTIMENT',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
      limit: '5',
      sort: 'LATEST',
      topics: 'financial_markets'
    };

    // Build query parameters
    const params = Object.keys(req.query).length === 0 
      ? defaultParams 
      : {
          ...defaultParams,
          ...(tickers && { tickers: tickers.toUpperCase() }),
          ...(topics && { topics }),
          ...(time_from && { time_from }),
          ...(sort && { sort }),
          ...(limit && { limit })
        };
    
    console.log('Making API request with params:', { ...params, apikey: '[REDACTED]' });
    
    // Enhanced retry logic
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;
    let retryDelay = 2000; // Start with 2 seconds

    while (retryCount < maxRetries) {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', { 
          params,
          timeout: 15000 // Increased timeout to 15 seconds
        });
        
        console.log('Alpha Vantage API response:', response.data);
        
        if (response.data.Note) {
          console.error('API rate limit note:', response.data.Note);
          // Set rate limit cache
          cache.isRateLimited = true;
          cache.rateLimitResetTime = Date.now() + 60 * 1000; // Assume 1 minute cooldown
          return res.json(mockData);
        }

        if (!response.data.feed) {
          console.error('No feed data in response:', response.data);
          return res.json(mockData);
        }
        
        // Format and cache the response
        const formattedData = formatNewsData(response.data);
        cache.data = formattedData;
        cache.timestamp = Date.now();
        cache.isRateLimited = false;
        
        console.log('Sending formatted response with', formattedData.feed.length, 'articles');
        return res.json(formattedData);
      } catch (err) {
        lastError = err;
        retryCount++;
        
        // Exponential backoff
        retryDelay *= 2;
        
        console.error(`Attempt ${retryCount} failed:`, {
          message: err.message,
          code: err.code,
          response: err.response?.data
        });
        
        if (retryCount < maxRetries) {
          console.log(`Retrying in ${retryDelay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
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
    return res.json(mockData);
  }
};

const saveArticle = async (req, res) => {
  try {
    const { article_id } = req.body;
    const user_id = req.user.id;

    await databaseService.query(
      'INSERT INTO saved_articles (user_id, article_id) VALUES ($1, $2) ON CONFLICT (user_id, article_id) DO NOTHING',
      [user_id, article_id]
    );

    res.json({ message: 'Article saved successfully' });
  } catch (error) {
    logger.error('Error saving article:', error);
    res.status(500).json({ error: 'Failed to save article' });
  }
};

const getSavedArticles = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await databaseService.query(
      'SELECT article_id FROM saved_articles WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching saved articles:', error);
    res.status(500).json({ error: 'Failed to fetch saved articles' });
  }
};

const deleteSavedArticle = async (req, res) => {
  try {
    const { article_id } = req.params;
    const user_id = req.user.id;

    await databaseService.query(
      'DELETE FROM saved_articles WHERE user_id = $1 AND article_id = $2',
      [user_id, article_id]
    );

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    logger.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

module.exports = {
  getNews,
  saveArticle,
  getSavedArticles,
  deleteSavedArticle
};
