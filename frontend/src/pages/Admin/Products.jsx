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
      .then(res => setProducts(res.data.data || res.data))
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Manage Products</h1>
        <Link to="/admin/products/create" className="bg-brand-accent text-brand-primary px-4 py-2 rounded font-bold hover:bg-brand-accent-hover transition-colors">
          + Add New Product
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 border-b text-slate-600 dark:text-slate-300">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name / Part No.</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b hover:bg-slate-50 dark:bg-slate-900">
                  <td className="py-3 px-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400">N/A</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-100">{product.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{product.partNumber || 'No Part #'}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-200">{product.category || 'Uncategorized'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.availability ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Link to={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline">Delete</button>
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
