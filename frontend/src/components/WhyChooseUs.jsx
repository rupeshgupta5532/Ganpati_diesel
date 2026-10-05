import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Wrench, Award } from 'lucide-react';

const sliderImages = [
  'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
];

const WhyChooseUs = () => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % sliderImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  const reasons = [
    {
      title: 'Certified Node Operators',
      description: 'Our team consists of ASE certified specialists operating at peak efficiency.',
      icon: Award
    },
    {
      title: 'High-Frequency Turnaround',
      description: 'Optimized algorithms to get your assets diagnosed and repaired with minimal latency.',
      icon: Clock
    },
    {
      title: 'Advanced Tooling',
      description: 'State-of-the-art diagnostic interfaces to handle modern complex diesel systems.',
      icon: Wrench
    },
    {
      title: 'Encrypted Guarantee',
      description: 'Comprehensive warranty protocols securing parts and labor.',
      icon: CheckCircle
    }
  ];

  return (
    <section id="why-us" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="text-xs font-medium text-primary tracking-wide uppercase">The Network Edge</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                Unmatched <br/>
                <span className="text-gradient">Performance.</span>
              </h3>
              <p className="text-gray-400 text-lg mb-12 leading-relaxed font-light">
                When your livelihood depends on your network, you can't afford latency. We combine mechanical grit with cutting-edge diagnostic technology to deliver protocols you can trust.
              </p>

              <div className="space-y-8">
                {reasons.map((reason, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                        <reason.icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">{reason.title}</h4>
                      <p className="text-gray-400 font-light text-sm">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] glass-card overflow-hidden relative p-4 flex items-center justify-center">
                {/* Live Repair Feed Slider */}
                <div className="w-full h-full rounded-[2.5rem] bg-dark relative overflow-hidden border border-white/5 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImg}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 0.6, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0 bg-cover bg-center mix-blend-screen filter grayscale-[20%]"
                      style={{ backgroundImage: `url(${sliderImages[currentImg]})` }}
                    />
                  </AnimatePresence>
                  
                  {/* Central glowing element */}
                  <div className="relative z-10 w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 backdrop-blur-md">
                    <div className="w-24 h-24 rounded-full border border-primary/50 flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,163,0.5)]">
                         <span className="text-primary font-bold text-2xl">99%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 glass border border-white/10 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
                <div className="text-4xl font-semibold mb-1 text-primary">15+</div>
                <div className="text-sm text-gray-400 font-light">Years of <br/>Network Uptime</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
