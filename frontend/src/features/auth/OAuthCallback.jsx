import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const userStr = searchParams.get('user');

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        login(accessToken, user);
        
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (e) {
        console.error('Failed to parse user data from OAuth callback', e);
        navigate('/login?error=Invalid_OAuth_Data', { replace: true });
      }
    } else {
      navigate('/login?error=OAuth_Failed', { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary">
      <div className="text-white text-xl font-bold flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p>Completing Secure Login...</p>
      </div>
    </div>
  );
};
