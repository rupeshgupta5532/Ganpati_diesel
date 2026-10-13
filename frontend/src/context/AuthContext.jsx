import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(undefined);

export const AuthProvider= ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
      if (token) {
        try {
          const profile = await api.get('/auth/profile');
          const userData = profile.data || profile;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('accessToken', token);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    try {
      const profile = await api.get('/auth/profile');
      const data = profile.data || profile;
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (e) {
      if (userData) setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminActiveTab');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
