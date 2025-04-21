import { useState } from 'react';

const NewsFilter = ({ filters, setFilters }) => {
  const [tickerInput, setTickerInput] = useState('');
  const [topicInput, setTopicInput] = useState('');

  const handleTickerChange = (e) => {
    setTickerInput(e.target.value.toUpperCase());
  };

  const handleTopicChange = (e) => {
    setTopicInput(e.target.value);
  };

  const addTicker = () => {
    if (tickerInput && !filters.tickers.includes(tickerInput)) {
      setFilters({
        ...filters,
        tickers: [...filters.tickers, tickerInput]
      });
      setTickerInput('');
    }
  };

  const addTopic = () => {
    if (topicInput && !filters.topics.includes(topicInput)) {
      setFilters({
        ...filters,
        topics: [...filters.topics, topicInput]
      });
      setTopicInput('');
    }
  };

  const removeTicker = (ticker) => {
    setFilters({
      ...filters,
      tickers: filters.tickers.filter(t => t !== ticker)
    });
  };

  const removeTopic = (topic) => {
    setFilters({
      ...filters,
      topics: filters.topics.filter(t => t !== topic)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock Tickers
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tickerInput}
            onChange={handleTickerChange}
            placeholder="e.g., AAPL, MSFT"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={addTicker}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.tickers.map((ticker) => (
            <span
              key={ticker}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {ticker}
              <button
                onClick={() => removeTicker(ticker)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topics
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={handleTopicChange}
            placeholder="e.g., technology, finance"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={addTopic}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.topics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {topic}
              <button
                onClick={() => removeTopic(topic)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Period
        </label>
        <select
          value={filters.timeFrom || ''}
          onChange={(e) => setFilters({ ...filters, timeFrom: e.target.value || null })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Time</option>
          <option value="20240401">Last Month</option>
          <option value="20240301">Last 2 Months</option>
          <option value="20240101">Last 4 Months</option>
        </select>
      </div>
    </div>
  );
};

export default NewsFilter;
  