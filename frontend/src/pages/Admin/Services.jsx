import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { adminServiceApi } from '../../api/adminApi';

export const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = () => {
    setLoading(true);
    adminServiceApi.getAll()
      .then(res => setServices(res.data.data || res.data))
      .catch(err => setError('Failed to load services.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      adminServiceApi.delete(id)
        .then(() => fetchServices())
        .catch(err => alert('Failed to delete service'));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Manage Services</h1>
        <Link to="/admin/services/create" className="bg-brand-accent text-brand-primary px-4 py-2 rounded font-bold hover:bg-brand-accent-hover transition-colors">
          + Add New Service
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">No services found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 border-b text-slate-600 dark:text-slate-300">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id} className="border-b hover:bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">{service.name}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{service.slug}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Link to={`/admin/services/${service._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
