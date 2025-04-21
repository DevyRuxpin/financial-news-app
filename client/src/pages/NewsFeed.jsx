import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import NewsFilter from '../components/NewsFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tickers: [],
    topics: [],
    timeFrom: null
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.tickers.length) params.append('tickers', filters.tickers.join(','));
      if (filters.topics.length) params.append('topics', filters.topics.join(','));
      if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);

      const response = await axios.get(`/api/news?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNews(response.data.feed);
    } catch (error) {
      toast.error('Failed to fetch news');
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (articleId) => {
    try {
      await axios.post('/api/news/save', { articleId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Article saved successfully');
    } catch (error) {
      toast.error('Failed to save article');
      console.error('Error saving article:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Financial News</h1>
      
      <NewsFilter 
        filters={filters}
        setFilters={setFilters}
      />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <NewsCard
              key={article.url}
              article={article}
              onSave={() => handleSaveArticle(article.url)}
            />
          ))}
        </div>
      )}
      
      {!loading && news.length === 0 && (
        <div className="text-center text-gray-500">
          No news articles found matching your filters.
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
