import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export const LoginForm = ({ isAdmin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          <div className="w-16 h-16 bg-brand-accent mx-auto rounded-xl flex items-center justify-center font-bold text-brand-primary text-3xl shadow dark:shadow-none-lg mb-4">
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
            <label className="block text-brand-primary text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors" 
              required 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
               <label className="block text-brand-primary text-sm font-bold uppercase tracking-wide">Password</label>
               <Link to="/forgot-password" className="text-brand-accent text-xs font-bold cursor-pointer hover:underline">Forgot?</Link>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-accent text-brand-primary py-4 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
          {!isAdmin && (
             <p className="text-center text-sm text-gray-500 mt-6">
               Don't have an account? <Link to="/signup" className="text-brand-primary font-bold hover:text-brand-accent transition-colors">Create Account</Link>
             </p>
          )}
        </form>
      </div>
    </div>
  );
};
