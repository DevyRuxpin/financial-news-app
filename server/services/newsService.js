const axios = require('axios');
const logger = require('../utils/logger');

// Mock data for fallback
const mockNews = [
  {
    title: "Tech Stocks Rally as AI Investments Surge",
    url: "https://example.com/tech-rally",
    time_published: "20240421T120000",
    summary: "Major tech companies report strong earnings driven by AI investments.",
    sentiment: "Bullish",
    tickers: ["AAPL", "MSFT", "GOOGL"]
  },
  {
    title: "Federal Reserve Holds Interest Rates Steady",
    url: "https://example.com/fed-rates",
    time_published: "20240421T110000",
    summary: "The Federal Reserve maintains current interest rates amid economic uncertainty.",
    sentiment: "Neutral",
    tickers: ["^DJI", "^GSPC", "^IXIC"]
  },
  {
    title: "Oil Prices Fall on Increased Production",
    url: "https://example.com/oil-prices",
    time_published: "20240421T100000",
    summary: "Global oil prices decline as production increases.",
    sentiment: "Bearish",
    tickers: ["XOM", "CVX", "BP"]
  }
];

class NewsService {
  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.baseUrl = 'https://www.alphavantage.co/query';
  }

  async getNews(tickers = [], topics = [], timeFrom = null) {
    try {
      if (!this.apiKey) {
        logger.warn('No Alpha Vantage API key found, using mock data');
        return this.getMockNews(tickers, topics, timeFrom);
      }

      const params = {
        function: 'NEWS_SENTIMENT',
        apikey: this.apiKey,
        tickers: tickers.join(','),
        topics: topics.join(','),
        time_from: timeFrom,
        sort: 'LATEST'
      };

      const response = await axios.get(this.baseUrl, { params });
      
      if (response.data.Note) {
        logger.warn('API rate limit reached, using mock data');
        return this.getMockNews(tickers, topics, timeFrom);
      }

      return this.processNewsData(response.data);
    } catch (error) {
      logger.error('Error fetching news:', error);
      return this.getMockNews(tickers, topics, timeFrom);
    }
  }

  getMockNews(tickers, topics, timeFrom) {
    let filteredNews = [...mockNews];
    
    if (tickers.length > 0) {
      filteredNews = filteredNews.filter(article => 
        article.tickers.some(ticker => tickers.includes(ticker))
      );
    }
    
    if (topics.length > 0) {
      filteredNews = filteredNews.filter(article => 
        topics.some(topic => article.summary.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    return {
      feed: filteredNews.map(article => ({
        ...article,
        sentiment_score: this.getSentimentScore(article.sentiment)
      }))
    };
  }

  processNewsData(data) {
    if (!data.feed) return { feed: [] };

    return {
      feed: data.feed.map(article => ({
        title: article.title,
        url: article.url,
        time_published: article.time_published,
        summary: article.summary,
        sentiment: this.getSentimentLabel(article.overall_sentiment_score),
        sentiment_score: article.overall_sentiment_score,
        tickers: article.ticker_sentiment?.map(t => t.ticker) || []
      }))
    };
  }

  getSentimentLabel(score) {
    if (score >= 0.3) return "Bullish";
    if (score <= -0.3) return "Bearish";
    return "Neutral";
  }

  getSentimentScore(sentiment) {
    switch(sentiment.toLowerCase()) {
      case 'bullish': return 0.5;
      case 'bearish': return -0.5;
      default: return 0;
    }
  }
}

module.exports = new NewsService(); 