import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export const Reviews = () => {
  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center relative z-10 pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full glass-card rounded-3xl p-12 border border-white/10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Node Feedback</h1>
          <p className="text-gray-400 text-lg mb-8">Real-time consensus and reviews from our network participants.</p>
          <div className="h-64 rounded-xl border border-white/10 bg-dark/50 flex items-center justify-center text-gray-500 font-mono">
            // Module Integration Pending
          </div>
        </motion.div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
