import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
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
      navigate(response.data.user.role === 'USER' ? '/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
            <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
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
               <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold uppercase tracking-wide">Password</label>
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
            className="w-full bg-brand-accent text-brand-primary dark:text-slate-300 py-4 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
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
