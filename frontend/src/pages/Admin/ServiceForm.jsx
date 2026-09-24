import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { adminServiceApi, uploadApi } from '../../api/adminApi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div className="p-10 text-red-600 bg-red-50 font-mono text-xs">{this.state.error.toString()}</div>;
    return this.props.children;
  }
}

const ServiceFormInner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '', image: '', isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      adminServiceApi.getAll().then(res => {
        const list = res.data || res;
        const srv = list.find(s => s._id === id);
        if (srv) setFormData({
          name: srv.name || '', slug: srv.slug || '', description: srv.description || '', shortDescription: srv.shortDescription || '', 
          image: srv.image || '', isActive: srv.isActive === undefined ? true : srv.isActive
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
    
    if (!payload.shortDescription) delete payload.shortDescription;
    if (!payload.description) delete payload.description;
    if (!payload.image) delete payload.image;
    
    const request = isEdit ? adminServiceApi.update(id, payload) : adminServiceApi.create(payload);
    
    request
      .then(() => navigate('/admin/services'))
      .catch(err => {
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) alert(msg.join('\n'));
        else alert(msg || 'Failed to save service');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-3xl bg-white dark:bg-slate-800 p-8 rounded shadow dark:shadow-none border border-brand-border/20 dark:border-brand-border/80">
      <h1 className="text-2xl font-bold mb-6 text-brand-primary dark:text-slate-100">{isEdit ? 'Edit Service' : 'Add New Service'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Service Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Slug (optional)</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Service Image</label>
          <div className="flex items-center space-x-2">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full border rounded p-1 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" disabled={uploading} />
            {uploading && <span className="text-xs text-blue-500 font-bold">Uploading...</span>}
          </div>
          {formData.image && (
            <div className="mt-2 text-xs">
               <img src={formData.image} alt="Preview" className="h-24 w-auto rounded border" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Short Description</label>
          <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-200">Detailed Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" required></textarea>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="active" />
          <label htmlFor="active" className="text-sm font-bold text-slate-800 dark:text-slate-200">Active / Visible to Public</label>
        </div>
        
        <div className="pt-4 flex space-x-4">
          <button type="submit" disabled={loading} className="bg-brand-accent text-brand-primary px-6 py-2 rounded font-bold hover:bg-brand-accent-hover">
            {loading ? 'Saving...' : 'Save Service'}
          </button>
          <button type="button" onClick={() => navigate('/admin/services')} className="px-6 py-2 rounded font-bold border hover:bg-gray-50 dark:bg-slate-900">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const ServiceForm = () => <ErrorBoundary><ServiceFormInner /></ErrorBoundary>;
