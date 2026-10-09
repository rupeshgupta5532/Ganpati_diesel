import React, { useEffect, useState } from 'react';
import { adminContactApi } from '../../api/adminApi';
import toast from 'react-hot-toast';

export const AdminContact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminContactApi.getContact()
      .then(res => setContact(res.data?.data || res.data || {}))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load contact info');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    adminContactApi.updateContact(contact)
      .then(() => toast.success('Business contact info published successfully!'))
      .catch(err => {
        console.error(err);
        toast.error('Failed to publish contact info.');
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading contact settings...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Business Contact Info</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage phone numbers, email, physical address, and store hours</p>
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
        {/* Primary Contact */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6">
            Primary Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Phone</label>
              <input 
                type="text" 
                name="primaryPhone" 
                value={contact?.primaryPhone || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp Number</label>
              <input 
                type="text" 
                name="whatsapp" 
                value={contact?.whatsapp || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Support Email</label>
            <input 
              type="email" 
              name="email" 
              value={contact?.email || ''} 
              onChange={handleChange} 
              className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
            />
          </div>
        </div>

        {/* Location & Hours */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6">
            Location & Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Physical Address</label>
              <input 
                type="text" 
                name="address" 
                value={contact?.address || ''} 
                onChange={handleChange} 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Opening Hours</label>
              <input 
                type="text" 
                name="openingHours" 
                value={contact?.openingHours || ''} 
                onChange={handleChange} 
                placeholder="e.g. Sun - Fri, 9AM - 6PM" 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Google Maps Embed URL</label>
            <textarea 
              name="googleMapsUrl" 
              value={contact?.googleMapsUrl || ''} 
              onChange={handleChange} 
              rows="3" 
              className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

