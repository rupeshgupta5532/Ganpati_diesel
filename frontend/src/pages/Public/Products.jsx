import React, { useEffect, useState } from 'react';
import { productApi } from '../../api/services';
import { Link } from 'react-router';

export const PublicProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getAll()
      .then(res => setProducts(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xl font-bold">Loading diesel components catalog...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16 font-sans">
      <div className="bg-brand-primary py-16 text-center border-b-4 border-brand-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <h1 className="text-4xl font-bold text-white mb-4 relative z-10">Genuine Fuel System Components</h1>
        <p className="text-slate-400 max-w-2xl mx-auto relative z-10">Original OEM parts, repair kits, and diesel fuel injection components.</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product._id} className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-md dark:shadow dark:shadow-none-none border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow dark:shadow-none-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer relative">
              <Link to={`/contact?subject=${encodeURIComponent('Product Inquiry: ' + product.name)}`} className="absolute inset-0 z-10">
                 <span className="sr-only">Enquire about {product.name}</span>
              </Link>
              
              <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-wider text-sm bg-slate-100 dark:bg-slate-700">
                    No Image
                  </div>
                )}
                {product.availability && (
                   <div className="absolute top-3 right-3 bg-brand-accent text-brand-primary text-xs font-bold px-3 py-1 rounded-full shadow dark:shadow-none-lg">
                     IN STOCK
                   </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col relative z-20">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{product.category || 'Component'}</div>
                <h2 className="text-xl font-extrabold text-brand-primary mb-1 leading-tight group-hover:text-blue-600 transition-colors">{product.name}</h2>
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 font-mono bg-slate-50 dark:bg-slate-900 inline-block px-2 py-1 rounded border border-slate-100 dark:border-slate-700 self-start">PN: {product.partNumber || 'N/A'}</div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                   {!product.availability && (
                     <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 uppercase">Out of Stock</span>
                   )}
                   {product.availability && <div></div>}
                   <Link to={`/contact?subject=${encodeURIComponent('Product Inquiry: ' + product.name)}`} className="text-blue-600 text-sm font-extrabold hover:text-blue-800 flex items-center space-x-1">
                     <span>Enquire Now</span>
                     <span className="text-lg leading-none">&rarr;</span>
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
