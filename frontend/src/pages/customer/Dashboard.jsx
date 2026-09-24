import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../api/bookingApi';
import { Link } from 'react-router';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(res => {
        const list = res.data?.data || res.data || [];
        setBookings(list);
        
        let pending = 0;
        let completed = 0;
        let cancelled = 0;
        
        list.forEach(b => {
           if (b.status === 'PENDING') pending++;
           else if (b.status === 'COMPLETED') completed++;
           else if (b.status === 'CANCELLED' || b.status === 'REJECTED') cancelled++;
        });

        setStats({
          total: list.length,
          pending,
          completed,
          cancelled
        });
      })
      .catch(console.error);
  }, []);
  
  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">Welcome, {user?.name}</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Here is an overview of your recent bookings and activities.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between hover:shadow dark:shadow-none-md transition-shadow border-t-4 border-t-blue-500">
           <span className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2">Total Bookings</span>
           <span className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats.total}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between hover:shadow dark:shadow-none-md transition-shadow border-t-4 border-t-orange-500">
           <span className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2">Pending</span>
           <span className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats.pending}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between hover:shadow dark:shadow-none-md transition-shadow border-t-4 border-t-green-500">
           <span className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2">Completed</span>
           <span className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats.completed}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between hover:shadow dark:shadow-none-md transition-shadow border-t-4 border-t-red-500">
           <span className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2">Cancelled</span>
           <span className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats.cancelled}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-brand-primary dark:text-slate-100">Recent Bookings</h2>
            {bookings.length > 0 && <Link to="/bookings" className="text-sm font-bold text-brand-accent hover:underline">View All</Link>}
         </div>
         {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                        <th className="p-4 font-bold">Service</th>
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Time</th>
                        <th className="p-4 font-bold">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {recentBookings.map(b => (
                        <tr key={b._id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-800 dark:text-slate-200">
                           <td className="p-4 font-bold text-brand-primary dark:text-slate-200">
                              {b.service?.name || b.serviceName || 'Custom Service'}
                           </td>
                           <td className="p-4 text-slate-600 dark:text-slate-300">
                              {new Date(b.preferredDate).toLocaleDateString()}
                           </td>
                           <td className="p-4 text-slate-600 dark:text-slate-300">
                              {b.preferredTime || 'N/A'}
                           </td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                b.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                b.status === 'CANCELLED' || b.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {b.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         ) : (
            <div className="p-8 text-center text-gray-400 dark:text-slate-500 text-sm">
               You have no recent bookings.
            </div>
         )}
      </div>
    </div>
  );
};
