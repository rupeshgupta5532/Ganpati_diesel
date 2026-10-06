import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export const LoginForm = ({ isAdmin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isAdmin ? '/auth/admin/login' : '/auth/user/login';
      const response = await api.post(endpoint, { email, password });
      
      login(response.data.accessToken, response.data.user);
      toast.success('Successfully logged in!');
      navigate(response.data.user.role === 'USER' ? '/dashboard' : '/admin/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Abstract Background Details */}
      <div className="absolute inset-0 opacity-5">
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-2xl overflow-hidden relative z-10 border border-brand-border/20 dark:border-brand-border/80">
        <div className={`p-8 text-center text-white ${isAdmin ? 'bg-brand-secondary' : 'bg-brand-primary'}`}>
          <div className="w-16 h-16 bg-brand-accent mx-auto rounded-xl flex items-center justify-center font-bold text-brand-primary dark:text-slate-300 text-3xl shadow dark:shadow-none-lg mb-4">
            G
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{isAdmin ? 'Admin Portal' : 'Welcome Back'}</h2>
          <p className="text-sm text-brand-text-secondary mt-2">
            {isAdmin ? 'Secure access for staff and management.' : 'Log in to manage your diesel services and bookings.'}
          </p>
        </div>
        
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-semibold rounded">{error}</div>}
          
          <div>
            <label className="block text-brand-primary dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email"
              className="w-full border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors" 
              required 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
               <label className="block text-brand-primary dark:text-slate-300 text-sm font-bold uppercase tracking-wide">Password</label>
               <Link to="/forgot-password" className="text-brand-accent text-xs font-bold cursor-pointer hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password"
                className="w-full border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors pr-12" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-accent transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-accent text-brand-primary dark:text-slate-300 py-4 rounded-lg font-bold text-lg shadow hover:bg-brand-accent-hover transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
          {!isAdmin && (
            <div className="mt-4">
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
                </div>
                <div className="relative px-4 bg-white dark:bg-slate-800 text-sm text-gray-500">
                  Or continue with
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
                    window.location.href = `${apiUrl}/auth/google`;
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-white py-3 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
                    window.location.href = `${apiUrl}/auth/github`;
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-900 dark:bg-black border-2 border-gray-900 dark:border-slate-700 text-white py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                  <span>Github</span>
                </button>
              </div>
            </div>
          )}
          
          {!isAdmin && (
             <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
               Don't have an account? <Link to="/signup" className="text-brand-primary dark:text-slate-300 font-bold hover:text-brand-accent transition-colors">Create Account</Link>
             </p>
          )}
        </form>
</div>
    </div>
  );
};
