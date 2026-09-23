import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export const SignupForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
          <div className="w-16 h-16 bg-brand-accent mx-auto rounded-xl flex items-center justify-center font-bold text-brand-primary text-3xl shadow dark:shadow-none-lg mb-4">
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
            <label className="block text-brand-primary text-sm font-bold mb-1 uppercase tracking-wide">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none" required />
          </div>
          
          <div>
            <label className="block text-brand-primary text-sm font-bold mb-1 uppercase tracking-wide">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none" required />
          </div>
          
          <div>
            <label className="block text-brand-primary text-sm font-bold mb-1 uppercase tracking-wide">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none" required />
          </div>
          
          <div>
            <label className="block text-brand-primary text-sm font-bold mb-1 uppercase tracking-wide">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none" required />
          </div>
          
          <div>
            <label className="block text-brand-primary text-sm font-bold mb-1 uppercase tracking-wide">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:border-brand-accent focus:ring-0 outline-none" required />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-primary py-3.5 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50 mt-4">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent transition-colors">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
