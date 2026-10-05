import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      {/* Grid */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 cursor-pointer group">
          <img src="/logo.png" alt="Ganpati Diesel" className="h-12 w-12 rounded-full border border-white/20 group-hover:border-primary transition-colors" />
          <span className="font-semibold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">
            Ganpati<span className="text-gray-400 font-light group-hover:text-white transition-colors">Diesel</span>
          </span>
        </Link>

        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to access your portal</p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-black font-semibold rounded-xl py-3 text-sm flex justify-center items-center gap-2 transition-all group mt-2">
              Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
