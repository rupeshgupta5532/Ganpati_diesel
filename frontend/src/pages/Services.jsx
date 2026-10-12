import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Settings, Hammer, Cpu, Droplet, Gauge, Zap } from 'lucide-react';
import { Link } from 'react-router';

export const Services = () => {
  const [servicesList, setServicesList] = React.useState([
    {
      icon: <Settings size={40} className="text-primary mb-4" />,
      title: 'Injector Calibration',
      desc: 'Precision tuning of CRDI injectors using our computerized BOSCH test benches for optimal fuel delivery.',
      price: 'From $120'
    },
    {
      icon: <Hammer size={40} className="text-primary mb-4" />,
      title: 'Pump Overhaul',
      desc: 'Complete teardown, inspection, and rebuild of high-pressure diesel pumps to factory specifications.',
      price: 'From $450'
    },
    {
      icon: <Cpu size={40} className="text-primary mb-4" />,
      title: 'ECU Diagnostics',
      desc: 'Advanced software diagnostics to clear fault codes, remap parameters, and resolve electronic glitches.',
      price: 'From $80'
    },
    {
      icon: <Gauge size={40} className="text-primary mb-4" />,
      title: 'Turbocharger Repair',
      desc: 'Balancing and rebuilding of heavy-duty turbos to restore boost pressure and eliminate oil leaks.',
      price: 'From $350'
    },
    {
      icon: <Droplet size={40} className="text-primary mb-4" />,
      title: 'Fuel System Flush',
      desc: 'Deep cleaning of the entire fuel line network to remove carbon deposits and water contamination.',
      price: 'From $150'
    },
    {
      icon: <Zap size={40} className="text-primary mb-4" />,
      title: 'Emergency Tuning',
      desc: 'Rapid response mobile tuning and diagnostics for fleet vehicles stuck on the highway.',
      price: 'Variable'
    }
  ]);

  React.useEffect(() => {
    import('../api/axios').then(({ default: api }) => {
      api.get('/services')
        .then(res => {
          const data = Array.isArray(res) ? res : (res.data || []);
          if (data && data.length > 0) {
            // Map the backend data to match the expected format (title, desc, price)
            const mappedData = data.map(backendSvc => ({
              icon: <Settings size={40} className="text-primary mb-4" />, // Fallback icon
              title: backendSvc.name || backendSvc.title,
              desc: backendSvc.shortDescription || backendSvc.description || backendSvc.desc,
              price: backendSvc.price || 'Contact for price'
            }));
            setServicesList(mappedData);
          }
        })
        .catch(err => console.error("Error fetching services:", err));
    });
  }, []);

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-4 text-white uppercase"
          >
            Our <span className="text-primary">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Comprehensive diagnostic and repair protocols engineered for modern diesel networks.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((svc, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="glass-card p-8 rounded-3xl border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500">
                {svc.icon}
              </div>
              {svc.icon}
              <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[60px]">{svc.desc}</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-mono text-primary font-bold">{svc.price}</span>
                <Link to="/book-service" className="text-xs uppercase tracking-wider font-semibold text-white hover:text-primary transition-colors">
                  Book Now →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
