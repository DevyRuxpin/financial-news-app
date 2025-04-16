import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import NewsFilter from '../components/NewsFilter';
import { AuthContext } from '../context/AuthContext';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tickers: '',
    topics: '',
    time_from: '',
    sort: 'LATEST'
  });
  const { user } = useContext(AuthContext);

  const fetchNews = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching news with params:', searchParams);
      const response = await axios.get('/api/news', { params: searchParams });
      console.log('News API response:', response.data);
      setArticles(response.data.feed || []);
    } catch (err) {
      console.error('Error fetching news:', err.response || err);
      setError('Failed to fetch news articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchNews(filters);
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
    fetchNews();
  }, []);

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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8">No articles found. Try adjusting your filters.</div>
      ) : (
        <div className="space-y-4">
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
