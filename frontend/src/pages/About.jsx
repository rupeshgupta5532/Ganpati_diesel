import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Wrench, Shield, Clock, Users, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export const About = () => {
  const stats = [
    { icon: <Clock className="text-primary" size={32} />, value: '20+', label: 'Years Experience' },
    { icon: <Wrench className="text-primary" size={32} />, value: '15k+', label: 'Engines Repaired' },
    { icon: <Users className="text-primary" size={32} />, value: '50+', label: 'Expert Mechanics' },
    { icon: <Award className="text-primary" size={32} />, value: '99%', label: 'Client Satisfaction' },
  ];

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 text-white uppercase tracking-tighter"
          >
            The Heartbeat of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Heavy Machinery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Founded in 2004, Ganpati Diesel has been the trusted partner for fleet operators across the nation, ensuring maximum uptime and unmatched engine performance.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-8 border border-white/10 text-center hover:bg-white/5 transition-all">
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white">Precision. Power. <br/>Performance.</h2>
            <p className="text-gray-400 leading-relaxed">
              We started as a humble garage with a single calibration machine. Today, our facility houses state-of-the-art diagnostic protocols and high-pressure test benches capable of tuning the most advanced common-rail diesel engines.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our philosophy is simple: diagnose accurately, repair swiftly, and prevent future failures. We don't just fix parts; we restore the pulse of your fleet.
            </p>
            <ul className="space-y-3 mt-6">
              {['Authorized BOSCH Service Center', 'ISO 9001:2015 Certified Facility', '24/7 Emergency Breakdown Support'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <Shield className="text-primary w-5 h-5 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl transform rotate-3"></div>
            <div className="glass-card rounded-3xl p-2 relative z-10 border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop" 
                alt="Workshop Facility" 
                className="rounded-2xl w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[40px] p-12 border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <h2 className="text-3xl font-bold text-white mb-6">Ready to experience the difference?</h2>
          <Link to="/book-service" className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
            Initialize Booking Protocol <ChevronRight size={20} />
          </Link>
        </motion.div>

      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
