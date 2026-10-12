import React, { useEffect, useState } from 'react';
import { adminContactApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { Phone, PhoneCall, Mail, MapPin, Clock, Globe, Save } from 'lucide-react';

export const AdminContact = () => {
  const [contact, setContact] = useState({
    primaryPhone: '',
    secondaryPhone: '',
    whatsapp: '',
    email: '',
    address: '',
    openingHours: '',
    googleMapsUrl: '',
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminContactApi.getContact()
      .then(res => {
        const data = res.data?.data || res.data || res || {};
        setContact(prev => ({ ...prev, ...data }));
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load contact info');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setContact(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setSaving(true);
    // Sanitize payload to only whitelisted fields
    const payload = {
      primaryPhone: contact?.primaryPhone || '',
      secondaryPhone: contact?.secondaryPhone || '',
      whatsapp: contact?.whatsapp || '',
      email: contact?.email || '',
      address: contact?.address || '',
      openingHours: contact?.openingHours || '',
      googleMapsUrl: contact?.googleMapsUrl || '',
      socialLinks: contact?.socialLinks || {},
    };

    adminContactApi.updateContact(payload)
      .then((res) => {
        const saved = res.data?.data || res.data || res;
        if (saved && typeof saved === 'object') {
          setContact(prev => ({ ...prev, ...saved }));
        }
        toast.success('Business contact info published successfully!');
      })
      .catch(err => {
        console.error('Failed to publish contact info:', err);
        const msg = err.response?.data?.message || err.message || 'Failed to publish contact info.';
        toast.error(Array.isArray(msg) ? msg[0] : msg);
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading contact settings...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Business Contact Info</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage phone numbers, emergency lines, email, physical address, and workshop hours</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-6 py-2.5 rounded-xl border border-green-500/20 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save size={18} />
          {saving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 bg-dark/40 shadow-xl backdrop-blur-md space-y-8">
        {/* Primary Contact Numbers & Email */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6 flex items-center gap-2">
            <Phone size={18} className="text-primary" />
            Communication Channels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Phone</label>
              <input 
                type="text" 
                name="primaryPhone" 
                value={contact?.primaryPhone || ''} 
                onChange={handleChange} 
                placeholder="+91 89693 64937"
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Emergency / Secondary Line</label>
              <input 
                type="text" 
                name="secondaryPhone" 
                value={contact?.secondaryPhone || ''} 
                onChange={handleChange} 
                placeholder="+91 98765 43210"
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
                placeholder="918969364937"
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Official Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={contact?.email || ''} 
              onChange={handleChange} 
              placeholder="service@ganpatidiesel.com"
              className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
            />
          </div>
        </div>

        {/* Location & Hours */}
        <div>
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-6 flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            Location & Workshop Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Physical Workshop Address</label>
              <input 
                type="text" 
                name="address" 
                value={contact?.address || ''} 
                onChange={handleChange} 
                placeholder="1234 Industrial Node, MI 48201"
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Operating / Workshop Hours</label>
              <input 
                type="text" 
                name="openingHours" 
                value={contact?.openingHours || ''} 
                onChange={handleChange} 
                placeholder="Mon - Sat, 8:00 AM - 8:00 PM" 
                className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Google Maps Embed URL</label>
              <span className="text-[11px] text-gray-500">Paste the URL from Google Maps Share &gt; Embed a map</span>
            </div>
            <textarea 
              name="googleMapsUrl" 
              value={contact?.googleMapsUrl || ''} 
              onChange={handleChange} 
              rows="3" 
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all font-mono text-xs"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};


