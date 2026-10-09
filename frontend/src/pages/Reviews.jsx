import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const Reviews = () => {
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    import('../api/axios').then(({ default: api }) => {
      api.get('/reviews')
        .then(res => {
          const data = Array.isArray(res) ? res : (res.data || []);
          setReviews(data || []);
        })
        .catch(err => {
          console.error("Error fetching reviews:", err);
          setReviews([]);
        });
    });
  }, []);

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-4 text-white uppercase"
          >
            Client <span className="text-primary">Testimonials</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            {[...Array(5)].map((_, i) => <Star key={i} className="text-primary fill-primary w-6 h-6" />)}
          </motion.div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Verified customer reviews and service records.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-white/10 text-center max-w-xl mx-auto">
            <Quote className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-400">Customer feedback and testimonials will appear here once submitted.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="glass-card p-8 rounded-3xl border border-white/10 relative"
              >
                <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${idx < (review.rating || 5) ? 'text-primary fill-primary' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">"{review.text || review.comment}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                    {(review.name || 'C').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{review.name || 'Verified Customer'}</h4>
                    <p className="text-gray-500 text-xs">{review.company || 'Customer'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
