import { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard';
import NewsFilter from './NewsFilter';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tickers: '',
    topics: '',
    time_from: '',
    sort: 'LATEST'
  });

  const fetchNews = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/news', { params: searchParams });
      setArticles(response.data.feed);
    } catch (err) {
      setError('Failed to fetch news articles');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial articles on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchNews(filters);
  };

  // Handle article save
  const handleSaveArticle = async (articleUrl) => {
    try {
      await axios.post('/api/news/save', { article_id: articleUrl });
      // You might want to show a success message here
    } catch (err) {
      console.error('Error saving article:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial News</h1>
      
      <NewsFilter filters={filters} setFilters={setFilters} />
      
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading articles...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8">No articles found</div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              article={article}
              onSave={handleSaveArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default News; 