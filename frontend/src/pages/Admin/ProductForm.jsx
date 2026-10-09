import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { adminProductApi, uploadApi } from '../../api/adminApi';

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '', slug: '', partNumber: '', category: '', description: '', price: '', image: '', availability: true, isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      adminProductApi.getAll().then(res => {
        const list = res.data || res;
        const p = list.find(x => x._id === id);
        if (p) setFormData({
          name: p.name || '', slug: p.slug || '', partNumber: p.partNumber || '', category: p.category || '', 
          description: p.description || '', price: p.price || '', image: p.image || '', 
          availability: p.availability === undefined ? true : p.availability,
          isActive: p.isActive === undefined ? true : p.isActive
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const res = await uploadApi.uploadFile(file);
      const url = res.data?.data?.secure_url || res.data?.secure_url || res.data?.url || res.data?.data?.url;
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData, slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-') };
    if (payload.price) payload.price = Number(payload.price);
    
    if (!payload.partNumber) delete payload.partNumber;
    if (!payload.category) delete payload.category;
    if (!payload.description) delete payload.description;
    if (!payload.image) delete payload.image;
    if (payload.price === '' || payload.price === undefined) delete payload.price;
    
    const request = isEdit ? adminProductApi.update(id, payload) : adminProductApi.create(payload);
    
    request
      .then(() => navigate('/admin/products'))
      .catch(err => {
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) alert(msg.join('\n'));
        else alert(msg || 'Failed to save product');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col p-6 md:p-12">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>

      <div className="max-w-3xl mx-auto w-full glass-card p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Slug (optional)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Part Number</label>
              <input type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Price ($ / Rs)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Product Image</label>
              <div className="flex items-center space-x-2">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full bg-dark/50 border border-white/10 rounded-xl p-2 text-xs text-gray-300 focus:outline-none focus:border-primary" disabled={uploading} />
                {uploading && <span className="text-xs text-primary font-bold animate-pulse">Uploading...</span>}
              </div>
              {formData.image && (
                <div className="mt-2">
                   <img src={formData.image} alt="Preview" className="h-20 w-auto rounded-xl border border-white/10 object-cover" />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Detailed Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary"></textarea>
          </div>
          
          <div className="flex space-x-6 pt-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} id="avail" className="w-4 h-4 rounded text-primary focus:ring-primary" />
              <label htmlFor="avail" className="text-sm font-bold text-gray-300 cursor-pointer">In Stock</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="active" className="w-4 h-4 rounded text-primary focus:ring-primary" />
              <label htmlFor="active" className="text-sm font-bold text-gray-300 cursor-pointer">Active (Visible)</label>
            </div>
          </div>
          
          <div className="pt-6 flex space-x-4">
            <button type="submit" disabled={loading} className="bg-primary text-black px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2.5 rounded-xl font-bold border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
