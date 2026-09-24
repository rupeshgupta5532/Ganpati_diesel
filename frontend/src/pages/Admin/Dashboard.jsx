import React, { useEffect, useState } from 'react';
import { dashboardApi, adminUserApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    dashboardApi.getAggregations()
      .then(res => {
        const payload = res.data || res;
        setStats({
          totalBookings: payload.bookings?.total || 0,
          pendingBookings: payload.bookings?.pending || 0,
          totalEnquiries: payload.enquiries?.total || 0,
          pendingReviews: payload.reviews?.pending || 0,
          totalUsers: payload.users?.total || 0
        });
      })
      .catch(console.error);
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (searchQuery = '') => {
    adminUserApi.getAll(searchQuery)
      .then(res => setUsers(res.data?.data || res.data || []))
      .catch(err => toast.error('Failed to load users'));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const filteredUsers = users.filter(u => roleFilter === 'ALL' || u.role === roleFilter);

  

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
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Reviews</h3>
          <p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats?.pendingReviews || 0}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 p-6 mb-8 h-96">
         <h2 className="text-lg font-bold text-brand-primary dark:text-slate-100 mb-6">Overview Statistics</h2>
         {stats ? (
           <ResponsiveContainer width="100%" height="100%">
             <BarChart
               data={[
                 { name: 'Total Users', count: stats.totalUsers },
                 { name: 'Total Bookings', count: stats.totalBookings },
                 { name: 'Pending Bookings', count: stats.pendingBookings },
                 { name: 'Total Enquiries', count: stats.totalEnquiries },
                 { name: 'Pending Reviews', count: stats.pendingReviews },
               ]}
               margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
             >
               <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
               <XAxis dataKey="name" tick={{fill: '#64748b'}} tickMargin={10} />
               <YAxis tick={{fill: '#64748b'}} allowDecimals={false} />
               <Tooltip 
                 cursor={{fill: 'transparent'}}
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
               />
               <Bar dataKey="count" fill="#F5A623" radius={[4, 4, 0, 0]} barSize={40} />
             </BarChart>
           </ResponsiveContainer>
         ) : (
           <div className="h-full w-full flex items-center justify-center">
             <p className="text-gray-400 animate-pulse">Loading chart data...</p>
           </div>
         )}
      </div>
      
      {/* Customer Directory Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 p-6 mb-8">
         <div className="flex flex-col md:flex-row justify-between items-center mb-6">
           <h2 className="text-lg font-bold text-brand-primary dark:text-slate-100 mb-4 md:mb-0">Customer Directory</h2>
           <div className="flex space-x-4 w-full md:w-auto">
             <input 
               type="text" 
               placeholder="Search by name or email..." 
               value={search}
               onChange={handleSearch}
               className="px-4 py-2 border rounded-lg w-full md:w-64 outline-none focus:border-brand-accent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"
             />
             <select 
               value={roleFilter} 
               onChange={(e) => setRoleFilter(e.target.value)}
               className="px-4 py-2 border rounded-lg outline-none focus:border-brand-accent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"
             >
               <option value="ALL">All Roles</option>
               <option value="USER">Customers</option>
               <option value="ADMIN">Admins</option>
             </select>
           </div>
         </div>
         
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                 <th className="p-4 font-bold">Name</th>
                 <th className="p-4 font-bold">Email / Phone</th>
                 <th className="p-4 font-bold">Role</th>
                 <th className="p-4 font-bold">Total Bookings</th>
                 <th className="p-4 font-bold">Services Taken</th>
                 <th className="p-4 font-bold">Joined</th>
               </tr>
             </thead>
             <tbody>
               {filteredUsers.length > 0 ? filteredUsers.map(user => (
                 <tr key={user._id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-800 dark:text-slate-200">
                   <td className="p-4 font-bold text-brand-primary dark:text-slate-200">{user.name}</td>
                   <td className="p-4">
                     <div className="text-sm">{user.email}</div>
                     <div className="text-xs text-gray-500">{user.phone}</div>
                   </td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                       {user.role}
                     </span>
                   </td>
                   <td className="p-4 font-semibold text-brand-accent">{user.totalBookings || 0}</td>
                   <td className="p-4 font-semibold text-blue-500">{user.servicesTaken || 0}</td>
                   <td className="p-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                 </tr>
               )) : (
                 <tr>
                   <td colSpan="6" className="p-8 text-center text-gray-400">No customers found.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>

    </div>
  );
};
