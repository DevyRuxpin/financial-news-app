import { useState, useEffect } from 'react';
import axios from 'axios';

const useNews = (initialParams = {}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchNews = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        ...params,
        ...(forceRefresh && { forceRefresh: 'true' })
      });

      const response = await axios.get(`/api/news?${queryParams}`);
      setNews(response.data.feed);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [params]);

  const refreshNews = () => {
    fetchNews(true);
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    news,
    loading,
    error,
    refreshNews,
    updateParams,
    params
  };
};

export default useNews; 