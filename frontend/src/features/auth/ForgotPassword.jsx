import React, { useState } from 'react';
import { Link } from 'react-router';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setSubmitted(true), 1000);
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
            Enter your email to receive recovery instructions.
          </p>
        </div>
        
        {submitted ? (
           <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
              <h3 className="text-xl font-bold text-brand-primary">Check your email</h3>
              <p className="text-gray-500">We've sent password reset instructions to <strong>{email}</strong>.</p>
              <Link to="/login" className="inline-block mt-4 text-brand-accent font-bold hover:underline">Return to Login</Link>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-brand-primary text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your registered email"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors" 
                required 
              />
            </div>
            
            <button type="submit" className="w-full bg-brand-accent text-brand-primary py-4 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors">
              Send Reset Link
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password? <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent transition-colors">Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
