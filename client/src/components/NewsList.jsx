import { useState } from 'react';
import NewsCard from './NewsCard';
import useNews from '../hooks/useNews';
import { ArrowPathIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NewsList = () => {
  const { news, loading, error, refreshNews, updateParams } = useNews();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sentiment: '',
    ticker: '',
    timeRange: '24h'
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshNews();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    updateParams({ [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      sentiment: '',
      ticker: '',
      timeRange: '24h'
    });
    updateParams({});
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg mb-4">Error loading news: {error}</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-all duration-200 hover:scale-105"
        >
          <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Financial News</h2>
          <p className="text-gray-600">Stay updated with the latest market insights and analysis</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-200 transition-all duration-200 hover:border-gray-300"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh News'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filter News</h3>
            <button
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <XMarkIcon className="h-5 w-5" />
              Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sentiment</label>
              <select
                name="sentiment"
                value={filters.sentiment}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Sentiments</option>
                <option value="Bullish">Bullish</option>
                <option value="Somewhat-Bullish">Somewhat Bullish</option>
                <option value="Neutral">Neutral</option>
                <option value="Somewhat-Bearish">Somewhat Bearish</option>
                <option value="Bearish">Bearish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticker</label>
              <input
                type="text"
                name="ticker"
                value={filters.ticker}
                onChange={handleFilterChange}
                placeholder="e.g., AAPL, MSFT"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                name="timeRange"
                value={filters.timeRange}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {news.map((article, index) => (
          <NewsCard
            key={index}
            article={article}
            onSave={() => {/* Handle save */}}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsList; 