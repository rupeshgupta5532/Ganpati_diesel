import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { adminProjectApi, uploadApi } from '../../api/adminApi';

const ProjectFormInner = () => {
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
        const p = list.find(x => x._id === id);
        if (p) setFormData({
          title: p.title || '', slug: p.slug || '', vehicle: p.vehicle || '', serviceType: p.serviceType || '', 
          problem: p.problem || '', solution: p.solution || '', description: p.description || '', 
          beforeImage: p.beforeImage || '', afterImage: p.afterImage || '', 
          isFeatured: p.isFeatured || false, isPublished: p.isPublished === undefined ? true : p.isPublished
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      const res = await uploadApi.uploadFile(file);
      // The Cloudinary URL will be in res.data.secure_url or res.data.url
      const url = res.data?.data?.secure_url || res.data?.secure_url || res.data?.url || res.data?.data?.url;
      if (url) {
        setFormData(prev => ({ ...prev, [type === 'before' ? 'beforeImage' : 'afterImage']: url }));
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData, slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-') };
    if (!payload.vehicle) delete payload.vehicle;
    if (!payload.serviceType) delete payload.serviceType;
    if (!payload.problem) delete payload.problem;
    if (!payload.solution) delete payload.solution;
    if (!payload.description) delete payload.description;
    if (!payload.beforeImage) delete payload.beforeImage;
    if (!payload.afterImage) delete payload.afterImage;
    
    const request = isEdit ? adminProjectApi.update(id, payload) : adminProjectApi.create(payload);
    
    request
      .then(() => navigate('/admin/projects'))
      .catch(err => alert(err.response?.data?.message || 'Failed to save project'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl bg-white dark:bg-slate-800 p-8 rounded shadow dark:shadow-none border border-brand-border/20 dark:border-brand-border/80">
      <h1 className="text-2xl font-bold mb-6 text-brand-primary dark:text-slate-100">{isEdit ? 'Edit Case Study' : 'Add New Case Study'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Slug (optional)</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Vehicle Name</label>
            <input type="text" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" placeholder="e.g. Mahindra Scorpio" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Service Type</label>
            <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" placeholder="e.g. CRDI Repair" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Before Image</label>
            <div className="flex items-center space-x-2">
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'before')} className="w-full border rounded p-1 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" disabled={uploading.before} />
              {uploading.before && <span className="text-xs text-blue-500 font-bold">Uploading...</span>}
            </div>
            {formData.beforeImage && (
              <div className="mt-2 text-xs">
                 <img src={formData.beforeImage} alt="Preview" className="h-20 w-auto rounded border" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">After Image</label>
            <div className="flex items-center space-x-2">
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'after')} className="w-full border rounded p-1 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" disabled={uploading.after} />
              {uploading.after && <span className="text-xs text-blue-500 font-bold">Uploading...</span>}
            </div>
            {formData.afterImage && (
              <div className="mt-2 text-xs">
                 <img src={formData.afterImage} alt="Preview" className="h-20 w-auto rounded border" />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Problem Identified</label>
          <input type="text" name="problem" value={formData.problem} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Solution Provided</label>
          <input type="text" name="solution" value={formData.solution} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Detailed Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"></textarea>
        </div>
        
        <div className="flex space-x-6 pt-2">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} id="featured" />
            <label htmlFor="featured" className="text-sm font-bold text-slate-800 dark:text-slate-200">Feature on Homepage</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} id="published" />
            <label htmlFor="published" className="text-sm font-bold text-slate-800 dark:text-slate-200">Published (Visible to public)</label>
          </div>
        </div>
        
        <div className="pt-4 flex space-x-4">
          <button type="submit" disabled={loading} className="bg-brand-accent text-brand-primary px-6 py-2 rounded font-bold hover:bg-brand-accent-hover">
            {loading ? 'Saving...' : 'Save Project'}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="px-6 py-2 rounded font-bold border hover:bg-gray-50 dark:bg-slate-900">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const ProjectForm = () => <ProjectFormInner />;
