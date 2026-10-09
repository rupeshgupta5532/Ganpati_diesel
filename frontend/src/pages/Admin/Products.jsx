import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { adminProductApi } from '../../api/adminApi';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    adminProductApi.getAll()
      .then(res => setProducts(res.data?.data || res.data || []))
      .catch(err => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      adminProductApi.delete(id)
        .then(() => fetchProducts())
        .catch(err => alert('Failed to delete product'));
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Spare Parts & Products</h2>
          <p className="text-xs text-gray-400 mt-1">Add, update, or remove inventory spare parts</p>
        </div>
        <Link to="/admin/products/create" className="bg-primary text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-hover transition-colors shadow-lg">
          + Add New Product
        </Link>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 border border-red-500/20 text-sm font-semibold">{error}</div>}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No products found in inventory.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Image</th>
                <th className="py-3.5 px-4 font-semibold">Name / Part No.</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Availability</th>
                <th className="py-3.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs text-gray-500 font-bold">N/A</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{product.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{product.partNumber || 'No Part #'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 font-medium">{product.category || 'Uncategorized'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${product.availability ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {product.availability ? 'In Stock' : 'Stock Not Listed Yet'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/products/${product._id}/edit`} className="text-primary hover:text-primary-hover text-xs uppercase font-bold tracking-wider bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300 text-xs uppercase font-bold tracking-wider bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-full transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
