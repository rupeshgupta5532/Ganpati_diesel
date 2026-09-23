import React, { useEffect, useState } from 'react';
import { adminContentApi } from '../../api/adminApi';

export const AdminContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminContentApi.getHomepage()
      .then(res => setContent(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    adminContentApi.updateHomepage(content)
      .then(() => alert('Website content updated successfully!'))
      .catch(err => alert('Failed to update content.'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading CMS...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Website CMS</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Publish Changes'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none p-6 space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Homepage Hero Section</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Hero Title</label>
            <input type="text" name="heroTitle" value={content?.heroTitle || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Hero Subtitle</label>
            <input type="text" name="heroSubtitle" value={content?.heroSubtitle || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Hero Description</label>
          <textarea name="heroDescription" value={content?.heroDescription || ''} onChange={handleChange} rows="3" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2 pt-6">Business Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Years Experience</label>
            <input type="text" name="yearsExperience" value={content?.yearsExperience || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Projects Completed</label>
            <input type="text" name="projectsCompleted" value={content?.projectsCompleted || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Established Year</label>
            <input type="text" name="establishedYear" value={content?.establishedYear || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2 pt-6">About Us Content</h2>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">About Section Text</label>
          <textarea name="aboutContent" value={content?.aboutContent || ''} onChange={handleChange} rows="5" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
        </div>
      </div>
    </div>
  );
};
