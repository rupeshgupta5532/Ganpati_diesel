import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/services';

export const CustomerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    userApi.updateProfile(formData)
      .then(() => setMessage('Profile updated successfully!'))
      .catch(() => setMessage('Failed to update profile.'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">My Profile</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none p-8 border-t-4 border-blue-600">
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b">
           <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400">
             {user?.name?.charAt(0) || 'U'}
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name}</h2>
             <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
           </div>
        </div>

        {message && (
          <div className={`p-4 rounded mb-6 font-semibold ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="pt-4 flex justify-end">
             <button type="submit" disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
               {saving ? 'Saving...' : 'Update Profile'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
