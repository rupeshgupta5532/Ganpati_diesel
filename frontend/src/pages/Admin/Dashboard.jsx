import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/adminApi';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.getAggregations()
      .then(res => setStats(res.data.data || res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">Operations Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Real-time overview of business metrics and incoming requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 border-l-4 border-l-brand-primary">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Bookings</h3>
          <p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats?.totalBookings || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 border-l-4 border-l-brand-accent">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Bookings</h3>
          <p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 border-l-4 border-l-blue-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Enquiries</h3>
          <p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats?.totalEnquiries || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 border-l-4 border-l-green-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Services</h3>
          <p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats?.totalServices || 0}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 p-6 mb-8 flex items-center justify-center h-64">
         <div className="text-center text-gray-400">
           <span className="text-4xl block mb-4">📈</span>
           <p className="font-semibold">Interactive Charts Ready For Data Population</p>
         </div>
      </div>
    </div>
  );
};
