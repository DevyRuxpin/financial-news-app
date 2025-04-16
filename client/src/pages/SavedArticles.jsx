import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import { AuthContext } from '../context/AuthContext';

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/news/saved/${user.id}`);
        setSavedArticles(response.data);
      } catch (err) {
        setError('Failed to fetch saved articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [user]);

  const handleRemove = async (articleId) => {
    try {
      await axios.delete(`/api/news/saved/${articleId}`);
      setSavedArticles(savedArticles.filter(article => article.article_id !== articleId));
    } catch (err) {
      console.error('Failed to remove article:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved Articles</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : savedArticles.length === 0 ? (
        <p>You haven't saved any articles yet.</p>
      ) : (
        <div className="mt-6">
          {savedArticles.map((savedArticle) => (
            <div key={savedArticle.id} className="relative">
              <NewsCard 
                article={savedArticle} 
                onSave={() => {}} 
              />
              <button
                onClick={() => handleRemove(savedArticle.article_id)}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedArticles;
