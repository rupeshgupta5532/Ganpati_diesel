import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Filter, X, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export const Products = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifiedQueries, setNotifiedQueries] = useState([]);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  const addToCart = (product) => {
    setCart([...cart, product]);
    // Optional: could auto-open cart here
    // setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, idx) => idx !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const priceStr = item.price ? item.price.toString().replace(/[^0-9.]/g, '') : '0';
    return sum + (parseFloat(priceStr) || 0);
  }, 0);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
      setCheckoutStep(1);
    }
  };

  const processCheckout = async (e) => {
    e.preventDefault();
    setCheckoutStep(2); // processing
    
    try {
      const { default: api } = await import('../api/axios');
      // Extract user info from auth token or context if available. 
      // As a fallback, we just say "A user".
      const userName = JSON.parse(localStorage.getItem('user'))?.name || 'A user';
      
      await api.post('/notifications/admin', {
        title: 'New Product Order',
        message: `${userName} has ordered ${cart.length} product(s) worth $${cartTotal.toFixed(2)}.`,
        type: 'NEW_ORDER'
      });
    } catch (err) {
      console.error('Failed to notify admin:', err);
    }

    setTimeout(() => {
      setCheckoutStep(3); // success
      setCart([]); // clear cart
      setTimeout(() => {
        setIsCheckoutOpen(false);
      }, 3000);
    }, 2000);
  };

  const [products, setProducts] = useState([]);

  React.useEffect(() => {
    import('../api/axios').then(({ default: api }) => {
      api.get('/products')
        .then(res => {
          const data = Array.isArray(res) ? res : (res.data || []);
          setProducts(data || []);
        })
        .catch(err => {
          console.error("Error fetching products:", err);
          setProducts([]);
        });
    });
  }, []);

  const categories = ['All', 'Injectors', 'Pumps', 'Filters', 'Electronics', 'Accessories'];
  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search part number or name..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary w-full"
              />
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary text-black px-4 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
            >
              <ShoppingCart className="w-4 h-4" /> Cart ({cart.length})
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

        {/* Product Grid or Stock Not Listed Yet */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => {
              const isOutOfStock = product.inStock === false || product.stock === 0;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all group flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={product.image || 'https://images.unsplash.com/photo-1589139886737-25eaf2105193?auto=format&fit=crop&q=80&w=400'} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
                    <span className="absolute top-3 right-3 z-20 bg-black/80 backdrop-blur-md text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
                      {product.category || 'Spare Part'}
                    </span>
                    {isOutOfStock && (
                      <span className="absolute top-3 left-3 z-20 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-red-400">
                        Stock Not Listed Yet
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-mono text-primary font-bold">{product.price || 'Contact for price'}</span>
                      {isOutOfStock ? (
                        <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                          Stock Not Listed Yet
                        </span>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-3xl border border-white/10"
          >
            <Search className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Stock Not Listed Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              {searchQuery 
                ? `We currently don't have parts matching "${searchQuery}" listed in stock.`
                : 'No products are currently listed in stock.'}
            </p>
            {searchQuery && (
              notifiedQueries.includes(searchQuery.toLowerCase()) ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-6 py-3 rounded-full border border-green-400/20 font-medium">
                  <CheckCircle className="w-5 h-5" /> We will notify you when it's back in stock!
                </div>
              ) : (
                <button 
                  onClick={() => setNotifiedQueries([...notifiedQueries, searchQuery.toLowerCase()])}
                  className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                >
                  Notify me when in stock
                </button>
              )
            )}
          </motion.div>
        )}
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Cart Sidebar Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)}
            ></div>
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-darker border-l border-white/10 h-full relative z-10 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-dark">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="text-primary" /> Your Cart
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                >
                  <X />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Your cart is empty.</p>
                    <p className="text-sm mt-2">Add some spare parts to get started.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx} 
                      className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5 relative group"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-black/20" />
                      <div className="flex-grow pr-8">
                        <h4 className="text-white font-semibold text-sm leading-tight mb-1">{item.name}</h4>
                        <p className="text-gray-400 text-xs mb-2">{item.category}</p>
                        <p className="text-primary font-mono font-bold">{item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(idx)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 p-2 transition-colors rounded-full hover:bg-red-400/10"
                        title="Remove Item"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-dark shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-4 text-white">
                    <span className="font-medium text-gray-300">Total Items ({cart.length})</span>
                    <span className="font-bold text-xl text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => checkoutStep !== 2 && setIsCheckoutOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 border border-white/10"
            >
              {checkoutStep === 1 && (
                <form onSubmit={processCheckout}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
                    <button type="button" onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
                      <X />
                    </button>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Shipping Address</label>
                      <textarea required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" rows="3" placeholder="Enter your full address"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                      <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="+1 (555) 000-0000" />
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-4 flex justify-between items-center text-white">
                      <span>Order Total</span>
                      <span className="font-bold text-xl text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors">
                    Confirm Order
                  </button>
                </form>
              )}

              {checkoutStep === 2 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">Processing Order</h2>
                  <p className="text-gray-400">Please wait while we secure your parts...</p>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
                  <p className="text-gray-400 mb-8">Your spare parts are being prepared for dispatch.</p>
                  <button onClick={() => setIsCheckoutOpen(false)} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors border border-white/10">
                    Back to Products
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
