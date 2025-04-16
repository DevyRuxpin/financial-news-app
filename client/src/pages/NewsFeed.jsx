import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import NewsFilter from '../components/NewsFilter';
import { AuthContext } from '../context/AuthContext';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [filters, setFilters] = useState({
    tickers: '',
    topics: '',
    time_from: '',
    sort: 'LATEST'
  });
  const { user } = useContext(AuthContext);

  const fetchNews = async (searchParams = {}, useMock = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching news with params:', searchParams);
      
      const response = await axios.get('/api/news', { 
        params: {
          ...searchParams,
          useMock: useMock ? 'true' : 'false'
        },
        timeout: 15000
      });
      
      console.log('News API response:', response.data);
      
      if (!response.data.feed || response.data.feed.length === 0) {
        setArticles([]);
        setError('No articles found. Try adjusting your filters.');
        return;
      }
      
      setArticles(response.data.feed);
      setUsingMockData(useMock);
    } catch (err) {
      console.error('Error fetching news:', err.response || err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch news articles. Please try again later.';
      setError(errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchNews(filters);
  };

  const toggleMockData = () => {
    fetchNews(filters, !usingMockData);
  };

  const handleSave = async (articleUrl) => {
    if (!user) {
      alert('Please login to save articles');
      return;
    }
    try {
      await axios.post('/api/news/save', {
        user_id: user.id,
        article_id: articleUrl
      });
      alert('Article saved successfully!');
    } catch (err) {
      console.error('Failed to save article:', err);
      alert('Failed to save article. Please try again.');
    }
  };

  // Fetch initial articles on component mount
  useEffect(() => {
    fetchNews(filters, true); // Start with mock data
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Financial News</h1>
        <button
          onClick={toggleMockData}
          className={`px-4 py-2 rounded transition-colors ${
            usingMockData 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {usingMockData ? 'Switch to Real Data' : 'Use Mock Data'}
        </button>
      </div>
      
      {usingMockData && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Note: Using mock data due to API rate limits. Real-time data will be available when the rate limit resets.</p>
        </div>
      )}
      
      <NewsFilter filters={filters} setFilters={setFilters} />
      
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No articles found. Try adjusting your filters.
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              article={article}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
