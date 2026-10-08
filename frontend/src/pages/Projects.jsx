import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = React.useState([
    {
      title: 'Fleet Overhaul for Apex Logistics',
      type: 'Complete Rebuild',
      desc: 'Rebuilt 15 Cummins ISX engines for a major logistics carrier, increasing fuel efficiency by 8% across the fleet.',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Emergency Generator Rescue',
      type: 'Field Service',
      desc: 'Mobile diagnostic unit deployed to a hospital to repair a failed CAT generator injection system during a power grid failure.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Marine Diesel Refit',
      type: 'Marine Calibration',
      desc: 'Calibrated twin marine diesel pumps for a commercial fishing vessel, ensuring optimal performance at sea.',
      image: 'https://images.unsplash.com/photo-1549643276-fdf2fab574f5?auto=format&fit=crop&q=80&w=800'
    }
  ]);

  React.useEffect(() => {
    import('../api/axios').then(({ default: api }) => {
      api.get('/projects')
        .then(res => {
          const data = Array.isArray(res) ? res : (res.data || []);
          if (data && data.length > 0) {
            setProjects(data);
          }
        })
        .catch(err => console.error("Error fetching projects:", err));
    });
  }, []);

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-4 text-white uppercase"
          >
            Featured <span className="text-primary">Projects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Real-world challenges. Engineered solutions.
          </motion.p>
        </div>

        <div className="space-y-12">
          {projects.map((project, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              key={i}
              className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 relative group rounded-3xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-[300px] md:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                />
              </div>
              
              <div className="w-full md:w-1/2 space-y-4 px-4 md:px-8">
                <span className="text-primary font-mono text-sm uppercase tracking-widest">{project.type}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">{project.title}</h2>
                <p className="text-gray-400 text-lg leading-relaxed">{project.desc}</p>
                <button className="flex items-center gap-2 text-white hover:text-primary transition-colors font-semibold mt-4 group">
                  Read Case Study <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
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
