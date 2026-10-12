import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Activity } from 'lucide-react';
import { Link } from 'react-router';

const bgImages = [
  '/hero-bg.jpg', // Epic golden hour truck
  '/indian_truck_2.jpg', // Truck grill close up
  '/indian_truck_3.jpg' // Mechanic working on Tata truck
];

const Hero = ({ cms: propCms }) => {
  const [currentBg, setCurrentBg] = useState(0);
  const [internalCms, setInternalCms] = useState(null);

  useEffect(() => {
    if (!propCms) {
      import('../api/services').then(({ websiteContentApi }) => {
        websiteContentApi.getHomepage()
          .then(res => setInternalCms(res.data?.data || res.data || res || {}))
          .catch(console.error);
      });
    }
  }, [propCms]);

  const cms = propCms || internalCms;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      
      {/* Blurry Image Background Slider */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImages[currentBg]})` }}
          />
        </AnimatePresence>
        
        {/* Dark overlays and slight blur to keep images visible but text readable */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-darker/70 via-transparent to-darker"></div>
      </div>

      {/* Decorative center glow specific to Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] max-w-full bg-primary/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full glass border-white/10 mb-6 sm:mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide uppercase">
            {cms?.heroSubtitle || "Ganpati Network Live"}
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter leading-[1.08] mb-6 sm:mb-8">
            {cms?.heroTitle ? (
              <span className="text-gradient">{cms.heroTitle}</span>
            ) : (
              <>
                The Future of <br/>
                <span className="text-gradient">Fleet Maintenance.</span>
              </>
            )}
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {cms?.heroDescription || "A next-generation ecosystem for heavy-duty diagnostics, optimizing truck performance through decentralized service networks and rapid response protocol."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center w-full sm:w-auto">
            <a 
              href="#services" 
              className="group bg-white hover:bg-gray-100 text-black px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-sm flex justify-center items-center gap-2 transition-all w-full sm:w-auto shadow-lg"
            >
              Get Started <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <Link 
              to="/login" 
              className="glass hover:bg-white/10 text-white border border-white/10 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-sm flex justify-center items-center gap-2 transition-all w-full sm:w-auto"
            >
              <Activity className="w-4 h-4 text-primary" /> Customer Portal
            </Link>
          </div>
        </motion.div>

        {/* Abstract Dashboard/Interface Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-5xl mt-12 sm:mt-20 md:mt-24 glass-card rounded-2xl p-2 sm:p-4 border border-white/10"
        >
          <div className="bg-black/50 rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] min-h-[160px] sm:min-h-0 relative border border-white/5">
            {/* Mock Dashboard UI */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-darker to-transparent"></div>
            
            {/* Overlay UI elements */}
            <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 flex justify-between items-start">
              <div className="glass px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Network Status</p>
                <p className="text-sm sm:text-xl font-mono text-primary font-bold">100% Operational</p>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/50"></div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;
