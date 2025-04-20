import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/json',
        },
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config = {}) => {
    return callApi({ ...config, method: 'GET', url });
  }, [callApi]);

  const post = useCallback((url, data, config = {}) => {
    return callApi({ ...config, method: 'POST', url, data });
  }, [callApi]);

  const put = useCallback((url, data, config = {}) => {
    return callApi({ ...config, method: 'PUT', url, data });
  }, [callApi]);

  const del = useCallback((url, config = {}) => {
    return callApi({ ...config, method: 'DELETE', url });
  }, [callApi]);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    del,
  };
};

export default useApi; 