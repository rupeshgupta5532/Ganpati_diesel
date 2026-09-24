import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export const SignupForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/user/signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      login(response.data.accessToken, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4 font-sans relative overflow-hidden py-12">
      <div className="absolute inset-0 opacity-5">
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-2xl overflow-hidden relative z-10 border border-brand-border/20 dark:border-brand-border/80">
        <div className="p-8 text-center text-white bg-brand-primary">
          <div className="w-16 h-16 bg-brand-accent mx-auto rounded-xl flex items-center justify-center font-bold text-brand-primary dark:text-slate-300 text-3xl shadow dark:shadow-none-lg mb-4">
            G
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
          <p className="text-sm text-brand-text-secondary mt-2">
            Join Nepal's leading diesel diagnostics platform.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-semibold rounded">{error}</div>}
          
          <div>
            <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold mb-1 uppercase tracking-wide">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
          </div>
          
          <div>
            <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold mb-1 uppercase tracking-wide">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
          </div>
          
          <div>
            <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold mb-1 uppercase tracking-wide">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
          </div>
          
          <div>
            <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold mb-1 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700 pr-12" 
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
          
          <div>
            <label className="block text-brand-primary dark:text-slate-300 dark:text-slate-300 text-sm font-bold mb-1 uppercase tracking-wide">Confirm Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700 pr-12" 
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
          
          <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-primary dark:text-slate-300 py-3.5 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50 mt-4">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
            Already have an account? <Link to="/login" className="text-brand-primary dark:text-slate-300 font-bold hover:text-brand-accent transition-colors">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
