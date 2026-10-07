import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Filter } from 'lucide-react';

export const Products = () => {
  const [filter, setFilter] = useState('All');

  const products = [
    { name: 'BOSCH CRDI Injector 0445120123', category: 'Injectors', price: '$250', image: 'https://images.unsplash.com/photo-1635393222380-5a3d00d23829?auto=format&fit=crop&q=80&w=400' },
    { name: 'Delphi High Pressure Pump', category: 'Pumps', price: '$850', image: 'https://images.unsplash.com/photo-1589139886737-25eaf2105193?auto=format&fit=crop&q=80&w=400' },
    { name: 'Cummins ISX Filter Kit', category: 'Filters', price: '$85', image: 'https://images.unsplash.com/photo-1620050858102-140cce43a755?auto=format&fit=crop&q=80&w=400' },
    { name: 'Denso Common Rail Sensor', category: 'Electronics', price: '$120', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=400' },
    { name: 'CAT C15 Injector Assembly', category: 'Injectors', price: '$320', image: 'https://images.unsplash.com/photo-1635393222380-5a3d00d23829?auto=format&fit=crop&q=80&w=400' },
    { name: 'Fuel Line Connector Kit', category: 'Accessories', price: '$45', image: 'https://images.unsplash.com/photo-1589139886737-25eaf2105193?auto=format&fit=crop&q=80&w=400' },
  ];

  const categories = ['All', 'Injectors', 'Pumps', 'Filters', 'Electronics', 'Accessories'];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black text-white uppercase"
            >
              Spare <span className="text-primary">Parts</span>
            </motion.h1>
            <p className="text-gray-400 mt-2">Genuine OEM and aftermarket diesel components.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search part number..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary w-full"
              />
            </div>
            <button className="bg-primary text-black px-4 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
              <ShoppingCart className="w-4 h-4" /> Cart (0)
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 mb-10 pb-2 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-primary text-black' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all group"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
                <span className="absolute top-3 right-3 z-20 bg-black/80 backdrop-blur-md text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
                  {product.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-mono text-primary font-bold">{product.price}</span>
                  <button className="text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors">
                    Add to Cart
                  </button>
                </div>
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
