import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would verify a JWT token here
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { email, password });
      setUser(response.data);
      return response.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
