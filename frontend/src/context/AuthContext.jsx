import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(undefined);

export const AuthProvider= ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const profile = await api.get('/auth/profile');
          setUser(profile.data || profile);
        } catch (error) {
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

const login = async (token, userData) => {
    localStorage.setItem('accessToken', token);
    try {
      const profile = await api.get('/auth/profile');
      setUser(profile.data || profile);
    } catch (e) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
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
