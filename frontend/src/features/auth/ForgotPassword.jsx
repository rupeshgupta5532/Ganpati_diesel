import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      toast.error('Failed to send OTP. Check email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error('Invalid OTP or failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-2xl overflow-hidden relative z-10 border border-brand-border/20 dark:border-brand-border/80">
        <div className="p-8 text-center text-white bg-brand-primary">
          <div className="w-16 h-16 bg-brand-accent mx-auto rounded-xl flex items-center justify-center font-bold text-brand-primary text-3xl shadow dark:shadow-none-lg mb-4">
            G
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-sm text-brand-text-secondary mt-2">
            {step === 1 ? 'Enter your email to receive recovery instructions.' : 'Enter the OTP sent to your email and your new password.'}
          </p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="p-8 space-y-6">
            <div>
              <label className="block text-brand-primary dark:text-slate-200 text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your registered email"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" 
                required 
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-primary py-4 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset OTP'}
            </button>
            
            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
              Remember your password? <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent transition-colors dark:text-brand-accent">Sign In</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="p-8 space-y-6">
            <div>
              <label className="block text-brand-primary dark:text-slate-200 text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                value={email} 
                disabled
                className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-100 text-gray-500 dark:bg-slate-800 dark:border-slate-700" 
              />
            </div>
            <div>
              <label className="block text-brand-primary dark:text-slate-200 text-sm font-bold mb-2 uppercase tracking-wide">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                placeholder="000000"
                maxLength={6}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700 text-center tracking-widest text-xl font-bold" 
                required 
              />
            </div>
            <div>
              <label className="block text-brand-primary dark:text-slate-200 text-sm font-bold mb-2 uppercase tracking-wide">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="Enter new password"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" 
                required 
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-primary py-4 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
