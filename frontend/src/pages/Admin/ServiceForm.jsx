import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { adminServiceApi, uploadApi } from '../../api/adminApi';
import ThemeSwitch from '../../components/ThemeSwitch';
import { Wrench, ArrowLeft, Upload, Image as ImageIcon, Loader2, CheckCircle2, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    image: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      adminServiceApi.getAll().then(res => {
        const list = res.data || res;
        const srv = Array.isArray(list) ? list.find(s => s._id === id) : null;
        if (srv) {
          setFormData({
            name: srv.name || '',
            slug: srv.slug || '',
            description: srv.description || '',
            shortDescription: srv.shortDescription || '', 
            image: srv.image || '',
            isActive: srv.isActive === undefined ? true : srv.isActive
          });
        }
      }).catch(err => {
        console.error(err);
        toast.error('Failed to load service details');
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
        toast.success('Image uploaded successfully');
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
    
    if (!payload.shortDescription) delete payload.shortDescription;
    if (!payload.description) delete payload.description;
    if (!payload.image) delete payload.image;
    
    const request = isEdit ? adminServiceApi.update(id, payload) : adminServiceApi.create(payload);
    
    request
      .then(() => {
        toast.success(isEdit ? 'Service updated successfully!' : 'New service created successfully!');
        navigate('/admin/services');
      })
      .catch(err => {
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) toast.error(msg.join('\n'));
        else toast.error(msg || 'Failed to save service');
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
        {/* Top Navigation Bar with Back link and Theme Switch */}
        <div className="flex items-center justify-between w-full">
          <button 
            type="button"
            onClick={() => navigate('/admin/services')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Back to Services</span>
          </button>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
          </div>
        </div>

        {/* Main Glass Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,163,0.15)]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">
                  {isEdit ? 'Edit Service Record' : 'Add New Service'}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure fleet maintenance, diagnostics, and component repair service protocols
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  Service Name <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. CRDI Injector Calibration"
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
                  placeholder="crdi-injector-calibration"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs transition-all" 
                />
              </div>
            </div>

            {/* Service Image Upload with Preview */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                Service Illustration / Image
              </label>
              
              <div className="border border-dashed border-white/15 rounded-2xl p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold cursor-pointer transition-all w-full text-center">
                      <Upload className="w-4 h-4 text-primary" />
                      <span>{uploading ? 'Uploading Asset...' : 'Choose Service Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        disabled={uploading} 
                      />
                    </label>
                    <p className="text-[10px] text-gray-500 mt-2 text-center sm:text-left">
                      Supported formats: JPG, PNG, WEBP. Max resolution 2000px.
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
                        alt="Service Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                Short Summary <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleChange} 
                placeholder="Brief high-level description displayed on cards and search results"
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                required 
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                Detailed Diagnostic & Protocol Description <span className="text-red-400">*</span>
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4" 
                placeholder="In-depth details of what the service entails, tooling used, and testing standards..."
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all custom-scrollbar" 
                required
              ></textarea>
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
                Active & Visible on Public Platform
              </label>
            </div>
            
            {/* Submit and Cancel Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-black font-extrabold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Saving Service...' : (isEdit ? 'Update Service' : 'Save & Publish Service')}</span>
              </button>

              <button 
                type="button" 
                onClick={() => navigate('/admin/services')} 
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
