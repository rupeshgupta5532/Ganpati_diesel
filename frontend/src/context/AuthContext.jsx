import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingProfileRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    if (isFetchingProfileRef.current) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    isFetchingProfileRef.current = true;
    try {
      const profile = await api.get('/auth/profile');
      const userData = profile.data || profile;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      isFetchingProfileRef.current = false;
    }
  }, []);

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
        await fetchProfile();
      }
      setIsLoading(false);
    };
    initAuth();
  }, [fetchProfile]);

  const login = useCallback(async (token, userData) => {
    localStorage.setItem('accessToken', token);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      await fetchProfile();
    }
  }, [fetchProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminActiveTab');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
