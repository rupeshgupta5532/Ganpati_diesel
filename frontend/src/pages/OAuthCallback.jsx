import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      toast.error('Social login failed.');
      navigate('/login');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);
        toast.success('Successfully logged in!');
        if (user.role === 'admin' || user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/book-service');
        }
      } catch (e) {
        console.error('Failed to parse user data from OAuth callback');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen bg-darker flex items-center justify-center">
      <div className="text-white text-xl">Authenticating...</div>
    </div>
  );
};
