import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import NewsFilter from '../components/NewsFilter';
import { AuthContext } from '../context/AuthContext';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tickers: '',
    topics: '',
    time_from: '',
    sort: 'LATEST',
    limit: '10'
  });
  const { user } = useContext(AuthContext);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/news?${params.toString()}`);
      setNews(response.data.feed || []);
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (articleId) => {
    if (!user) return;
    try {
      await axios.post('/api/news/save', {
        user_id: user.id,
        article_id: articleId
      });
      alert('Article saved successfully!');
    } catch (err) {
      console.error('Failed to save article:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Financial News</h1>
      
      <NewsFilter filters={filters} setFilters={setFilters} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : news.length === 0 ? (
        <p>No news articles found. Try adjusting your filters.</p>
      ) : (
        <div className="mt-6">
          {news.map((article, index) => (
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
