import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { adminProductApi, uploadApi } from '../../api/adminApi';
import ThemeSwitch from '../../components/ThemeSwitch';
import { Package, ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
        const p = Array.isArray(list) ? list.find(x => x._id === id) : null;
        if (p) setFormData({
          name: p.name || '', slug: p.slug || '', partNumber: p.partNumber || '', category: p.category || '', 
          description: p.description || '', price: p.price || '', image: p.image || '', 
          availability: p.availability === undefined ? true : p.availability,
          isActive: p.isActive === undefined ? true : p.isActive
        });
      }).catch(err => {
        console.error(err);
        toast.error('Failed to load product details');
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
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
        toast.success('Product image uploaded');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      ...formData, 
      slug: formData.slug || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') 
    };
    if (payload.price) payload.price = Number(payload.price);
    if (!payload.partNumber) delete payload.partNumber;
    if (!payload.category) delete payload.category;
    if (!payload.description) delete payload.description;
    if (!payload.price && payload.price !== 0) delete payload.price;
    if (!payload.image) delete payload.image;
    
    const request = isEdit ? adminProductApi.update(id, payload) : adminProductApi.create(payload);
    
    request
      .then(() => {
        toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
        navigate('/admin/products');
      })
      .catch(err => {
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) toast.error(msg.join('\n'));
        else toast.error(msg || 'Failed to save product');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-x-hidden flex flex-col justify-center items-center py-10 px-4 sm:px-6 md:px-8 selection:bg-primary/30 selection:text-white">
      {/* Ambient background glow mesh */}
      <div className="blob blob-1 fixed opacity-15 pointer-events-none"></div>
      <div className="blob blob-2 fixed opacity-15 pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"></div>

      {/* Centered Container Wrapper */}
      <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex items-center justify-between w-full">
          <button 
            type="button"
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/admin/products');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
          </div>
        </div>

        {/* Form Glass Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,163,0.15)]">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">
                  {isEdit ? 'Edit Spare Part Record' : 'Add New Spare Part / Product'}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage inventory specifications, genuine OEM part numbers, and catalog pricing
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Bosch Common Rail Injector 0445"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  URL Slug (Optional)
                </label>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange} 
                  placeholder="bosch-common-rail-0445"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs transition-all" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  OEM Part Number
                </label>
                <input 
                  type="text" 
                  name="partNumber" 
                  value={formData.partNumber} 
                  onChange={handleChange} 
                  placeholder="e.g. 0445120231"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  Category
                </label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  placeholder="e.g. Fuel Injectors, Fuel Pumps"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  Price (₹)
                </label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="e.g. 14500"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  Stock Availability
                </label>
                <div className="flex items-center gap-3 h-[46px] px-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <input 
                    type="checkbox" 
                    name="availability" 
                    checked={formData.availability} 
                    onChange={handleChange} 
                    id="availability"
                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-dark/50 border-white/20 cursor-pointer" 
                  />
                  <label htmlFor="availability" className="text-xs font-bold text-gray-300 cursor-pointer select-none">
                    In Stock & Available
                  </label>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                Product Photo
              </label>
              
              <div className="border border-dashed border-white/15 rounded-2xl p-4 bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold cursor-pointer transition-all w-full text-center">
                      <Upload className="w-4 h-4 text-primary" />
                      <span>{uploading ? 'Uploading Photo...' : 'Choose Product Photo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        disabled={uploading} 
                      />
                    </label>
                    <p className="text-[10px] text-gray-500 mt-2 text-center sm:text-left">
                      Supported formats: JPG, PNG, WEBP.
                    </p>
                  </div>

                  {uploading && (
                    <div className="flex items-center gap-2 text-xs text-primary font-bold animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  )}

                  {formData.image && (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/15 bg-black/40 flex-shrink-0">
                      <img 
                        src={formData.image} 
                        alt="Product Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                Description / Technical Specifications
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4" 
                placeholder="Engine compatibility, OE references, nozzle specs..."
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all custom-scrollbar" 
              />
            </div>
            
            {/* Active Switch */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <input 
                type="checkbox" 
                name="isActive" 
                checked={formData.isActive} 
                onChange={handleChange} 
                id="active"
                className="w-4 h-4 rounded text-primary focus:ring-primary bg-dark/50 border-white/20 cursor-pointer"
              />
              <label htmlFor="active" className="text-xs font-bold text-gray-300 cursor-pointer select-none">
                Active & Visible in Catalog
              </label>
            </div>
            
            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-black font-extrabold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Saving Product...' : (isEdit ? 'Update Product' : 'Save & List Product')}</span>
              </button>

              <button 
                type="button" 
                onClick={() => navigate('/admin/products')} 
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-bold text-sm transition-all text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
