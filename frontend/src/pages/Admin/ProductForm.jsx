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
    <div className="max-w-3xl bg-white dark:bg-slate-800 p-8 rounded shadow dark:shadow-none border border-brand-border/20 dark:border-brand-border/80">
      <h1 className="text-2xl font-bold mb-6 text-brand-primary dark:text-slate-100">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Slug (optional)</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Part Number</label>
            <input type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Price (NPR)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Product Image</label>
            <div className="flex items-center space-x-2">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full border rounded p-1 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" disabled={uploading} />
              {uploading && <span className="text-xs text-blue-500 font-bold">Uploading...</span>}
            </div>
            {formData.image && (
              <div className="mt-2 text-xs">
                 <img src={formData.image} alt="Preview" className="h-20 w-auto rounded border" />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Detailed Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"></textarea>
        </div>
        
        <div className="flex space-x-6 pt-2">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} id="avail" />
            <label htmlFor="avail" className="text-sm font-bold text-slate-800 dark:text-slate-200">In Stock</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="active" />
            <label htmlFor="active" className="text-sm font-bold text-slate-800 dark:text-slate-200">Active (Visible)</label>
          </div>
        </div>
        
        <div className="pt-4 flex space-x-4">
          <button type="submit" disabled={loading} className="bg-brand-accent text-brand-primary px-6 py-2 rounded font-bold hover:bg-brand-accent-hover">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2 rounded font-bold border hover:bg-gray-50 dark:bg-slate-900">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
