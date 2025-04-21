import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const SavedArticles = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  const fetchSavedArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/news/saved', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setArticles(response.data.articles);
      setError(null);
    } catch (err) {
      setError('Failed to fetch saved articles');
      toast.error('Failed to load saved articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleUrl) => {
    try {
      await axios.delete(`/api/news/saved/${encodeURIComponent(articleUrl)}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setArticles(articles.filter(article => article.url !== articleUrl));
      toast.success('Article removed from saved articles');
    } catch (err) {
      toast.error('Failed to remove article');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Articles</h1>
          <p className="mt-2 text-gray-600">
            {articles.length === 0 
              ? "You haven't saved any articles yet."
              : `You have ${articles.length} saved article${articles.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard
              key={article.url}
              article={article}
              onDelete={() => handleDelete(article.url)}
              isSaved={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedArticles;
