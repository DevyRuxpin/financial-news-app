const axios = require('axios');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');
const newsService = require('../services/newsService');

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

class NewsController {
  async getNews(req, res) {
    try {
      const { tickers, topics, timeFrom } = req.query;
      
      const tickerArray = tickers ? tickers.split(',') : [];
      const topicArray = topics ? topics.split(',') : [];
      
      const news = await newsService.getNews(tickerArray, topicArray, timeFrom);
      
      // Check if articles are saved for the current user
      const articlesWithSavedStatus = await Promise.all(
        news.feed.map(async (article) => {
          const isSaved = await databaseService.isArticleSaved(req.user.id, article.url);
          return { ...article, isSaved };
        })
      );
      
      res.json({ feed: articlesWithSavedStatus });
    } catch (error) {
      logger.error('Error in getNews controller:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  }

  async saveArticle(req, res) {
    try {
      const { articleId } = req.body;
      const userId = req.user.id;

      // Get the full article details
      const news = await newsService.getNews();
      const article = news.feed.find(a => a.url === articleId);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      await databaseService.saveArticle(userId, article);
      
      res.json({ message: 'Article saved successfully' });
    } catch (error) {
      logger.error('Error in saveArticle controller:', error);
      res.status(500).json({ error: 'Failed to save article' });
    }
  }

  async getSavedArticles(req, res) {
    try {
      const userId = req.user.id;
      const articles = await databaseService.getSavedArticles(userId);
      
      res.json({ articles });
    } catch (error) {
      logger.error('Error in getSavedArticles controller:', error);
      res.status(500).json({ error: 'Failed to fetch saved articles' });
    }
  }

  async deleteSavedArticle(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user.id;

      await databaseService.deleteSavedArticle(userId, articleId);
      
      res.json({ message: 'Article deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteSavedArticle controller:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  }
}

module.exports = new NewsController();
