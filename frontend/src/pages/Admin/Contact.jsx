import React, { useEffect, useState } from 'react';
import { adminContactApi } from '../../api/adminApi';

export const AdminContact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminContactApi.getContact()
      .then(res => setContact(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    adminContactApi.updateContact(contact)
      .then(() => alert('Contact information updated successfully!'))
      .catch(err => alert('Failed to update contact info.'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading contact settings...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Business Contact Info</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Publish Changes'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none p-6 space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Primary Contact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Primary Phone</label>
            <input type="text" name="primaryPhone" value={contact?.primaryPhone || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">WhatsApp Number</label>
            <input type="text" name="whatsapp" value={contact?.whatsapp || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Support Email</label>
            <input type="email" name="email" value={contact?.email || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2 pt-6">Location & Hours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Physical Address</label>
            <input type="text" name="address" value={contact?.address || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Opening Hours</label>
            <input type="text" name="openingHours" value={contact?.openingHours || ''} onChange={handleChange} placeholder="e.g. Sun - Fri, 9AM - 6PM" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Google Maps Embed URL</label>
           <textarea name="googleMapsUrl" value={contact?.googleMapsUrl || ''} onChange={handleChange} rows="3" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"></textarea>
        </div>
      </div>
    </div>
  );
};
