import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { adminProjectApi, uploadApi } from '../../api/adminApi';
import ThemeSwitch from '../../components/ThemeSwitch';
import { FolderGit2, ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '', slug: '', vehicle: '', serviceType: '', problem: '', solution: '', description: '', beforeImage: '', afterImage: '', isFeatured: false, isPublished: true
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ before: false, after: false });

  useEffect(() => {
    if (isEdit) {
      adminProjectApi.getAll().then(res => {
        const list = res.data || res;
        const p = Array.isArray(list) ? list.find(x => x._id === id) : null;
        if (p) setFormData({
          title: p.title || '', slug: p.slug || '', vehicle: p.vehicle || '', serviceType: p.serviceType || '', 
          problem: p.problem || '', solution: p.solution || '', description: p.description || '', 
          beforeImage: p.beforeImage || '', afterImage: p.afterImage || '', 
          isFeatured: p.isFeatured || false, isPublished: p.isPublished === undefined ? true : p.isPublished
        });
      }).catch(err => {
        console.error(err);
        toast.error('Failed to load project details');
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      const res = await uploadApi.uploadFile(file);
      const url = res.data?.data?.secure_url || res.data?.secure_url || res.data?.url || res.data?.data?.url;
      if (url) {
        setFormData(prev => ({ ...prev, [type === 'before' ? 'beforeImage' : 'afterImage']: url }));
        toast.success(`${type === 'before' ? 'Before' : 'After'} image uploaded`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      ...formData, 
      slug: formData.slug || formData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') 
    };
    if (!payload.vehicle) delete payload.vehicle;
    if (!payload.serviceType) delete payload.serviceType;
    if (!payload.problem) delete payload.problem;
    if (!payload.solution) delete payload.solution;
    if (!payload.beforeImage) delete payload.beforeImage;
    if (!payload.afterImage) delete payload.afterImage;
    
    const request = isEdit ? adminProjectApi.update(id, payload) : adminProjectApi.create(payload);
    
    request
      .then(() => {
        toast.success(isEdit ? 'Project updated successfully' : 'Project created successfully');
        navigate('/admin/projects');
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to save project');
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
            onClick={() => navigate('/admin/projects')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Back to Projects</span>
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
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">
                  {isEdit ? 'Edit Case Study' : 'Add New Case Study'}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Showcase diagnostic milestones, heavy fleet overhauls, and before/after repair records
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="e.g. Cummins QSX15 Engine Overhaul"
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
                  placeholder="cummins-qsx15-overhaul"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs transition-all" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Vehicle / Engine Model</label>
                <input 
                  type="text" 
                  name="vehicle" 
                  value={formData.vehicle} 
                  onChange={handleChange} 
                  placeholder="e.g. Volvo FH16 or Mahindra Scorpio"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Service Category</label>
                <input 
                  type="text" 
                  name="serviceType" 
                  value={formData.serviceType} 
                  onChange={handleChange} 
                  placeholder="e.g. CRDI Diagnostics & Calibration"
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Reported Problem</label>
                <textarea 
                  name="problem" 
                  value={formData.problem} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Describe initial symptoms or error codes..."
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all custom-scrollbar" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Executed Solution</label>
                <textarea 
                  name="solution" 
                  value={formData.solution} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Describe repair protocol and replaced components..."
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all custom-scrollbar" 
                />
              </div>
            </div>

            {/* Before and After Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-dashed border-white/15 rounded-2xl p-4 bg-white/[0.02]">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">Before Repair Image</label>
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold cursor-pointer transition-all w-full text-center">
                  <Upload className="w-4 h-4 text-primary" />
                  <span>{uploading.before ? 'Uploading...' : 'Choose Before Photo'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'before')} className="hidden" disabled={uploading.before} />
                </label>
                {formData.beforeImage && (
                  <div className="mt-3 relative group w-20 h-20 rounded-xl overflow-hidden border border-white/15">
                    <img src={formData.beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(p => ({ ...p, beforeImage: '' }))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="border border-dashed border-white/15 rounded-2xl p-4 bg-white/[0.02]">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">After Repair Image</label>
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold cursor-pointer transition-all w-full text-center">
                  <Upload className="w-4 h-4 text-primary" />
                  <span>{uploading.after ? 'Uploading...' : 'Choose After Photo'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'after')} className="hidden" disabled={uploading.after} />
                </label>
                {formData.afterImage && (
                  <div className="mt-3 relative group w-20 h-20 rounded-xl overflow-hidden border border-white/15">
                    <img src={formData.afterImage} alt="After" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(p => ({ ...p, afterImage: '' }))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                Detailed Case Summary <span className="text-red-400">*</span>
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4" 
                placeholder="Complete project narrative and post-service dyno/test results..."
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all custom-scrollbar" 
                required 
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer select-none">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded text-primary focus:ring-primary bg-dark/50 border-white/20" />
                <span>Featured Project on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer select-none">
                <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="w-4 h-4 rounded text-primary focus:ring-primary bg-dark/50 border-white/20" />
                <span>Published & Publicly Visible</span>
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
                <span>{loading ? 'Saving Case Study...' : (isEdit ? 'Update Case Study' : 'Save & Publish Case Study')}</span>
              </button>

              <button 
                type="button" 
                onClick={() => navigate('/admin/projects')} 
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
