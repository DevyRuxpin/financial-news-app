const express = require('express');
const { getNews, saveArticle, getSavedArticles, deleteSavedArticle } = require('../controllers/newsController');
const { jwtStrategy } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getNews);
router.get('/mock', (req, res) => {
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
  res.json(mockData);
});

// Protected routes
router.post('/save', jwtStrategy, saveArticle);
router.get('/saved/:user_id', jwtStrategy, getSavedArticles);
router.delete('/saved/:article_id', jwtStrategy, deleteSavedArticle);

module.exports = router;
