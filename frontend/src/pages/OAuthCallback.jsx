import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      handledRef.current = true;
      toast.error('Social login failed.');
      navigate('/login', { replace: true });
      return;
    }

    if (token && userStr) {
      handledRef.current = true;
      const processAuth = async () => {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          await login(token, user);
          toast.success('Successfully logged in!');
          const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'admin';
          navigate(isAdmin ? '/admin/dashboard' : '/book-service', { replace: true });
        } catch (e) {
          console.error('Failed to parse user data from OAuth callback', e);
          toast.error('Authentication error occurred');
          navigate('/login', { replace: true });
        }
      };
      processAuth();
    } else {
      handledRef.current = true;
      navigate('/login', { replace: true });
    }
  }, [location.search, login, navigate]);

  return (
    <div className="min-h-screen bg-darker flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white text-lg font-semibold tracking-wide">Authenticating...</div>
        <div className="text-xs text-gray-500">Completing secure sign-in</div>
      </div>
    </div>
  );
};
