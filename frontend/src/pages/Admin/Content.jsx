import React, { useEffect, useState } from 'react';
import { adminContentApi } from '../../api/adminApi';
import toast from 'react-hot-toast';

export const AdminContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminContentApi.getHomepage()
      .then(res => setContent(res.data?.data || res.data || {}))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load website content');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    adminContentApi.updateHomepage(content)
      .then(() => toast.success('Website content published successfully!'))
      .catch(err => {
        console.error(err);
        toast.error('Failed to publish website content.');
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading website CMS...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Website CMS</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage public landing page hero, stats, and about content</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-6 py-2.5 rounded-xl border border-green-500/20 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50"
        >
          {saving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 bg-dark/40 shadow-xl backdrop-blur-md space-y-8">
        {/* Hero Section */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6 flex items-center justify-between">
            Homepage Hero Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hero Title</label>
              <input 
                type="text" 
                name="heroTitle" 
                value={content?.heroTitle || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hero Subtitle</label>
              <input 
                type="text" 
                name="heroSubtitle" 
                value={content?.heroSubtitle || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hero Description</label>
            <textarea 
              name="heroDescription" 
              value={content?.heroDescription || ''} 
              onChange={handleChange} 
              rows="3" 
              className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all"
            ></textarea>
          </div>
        </div>

        {/* Business Statistics */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6">
            Business Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Years Experience</label>
              <input 
                type="text" 
                name="yearsExperience" 
                value={content?.yearsExperience || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Projects Completed</label>
              <input 
                type="text" 
                name="projectsCompleted" 
                value={content?.projectsCompleted || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Established Year</label>
              <input 
                type="text" 
                name="establishedYear" 
                value={content?.establishedYear || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>
        </div>

        {/* About Us Content */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6">
            About Us Content
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Section Text</label>
            <textarea 
              name="aboutContent" 
              value={content?.aboutContent || ''} 
              onChange={handleChange} 
              rows="5" 
              className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

