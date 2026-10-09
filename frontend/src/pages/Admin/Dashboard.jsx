import React, { useEffect, useState } from 'react';
import { dashboardApi, adminUserApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboardOverview = () => {
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Operations Overview</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time business performance metrics and active registrations</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10 border-l-4 border-l-primary bg-dark/40 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Bookings</h3>
          <p className="text-4xl font-extrabold text-white tracking-tight">{stats?.totalBookings || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10 border-l-4 border-l-yellow-500 bg-dark/40 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Bookings</h3>
          <p className="text-4xl font-extrabold text-yellow-400 tracking-tight">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10 border-l-4 border-l-blue-500 bg-dark/40 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Enquiries</h3>
          <p className="text-4xl font-extrabold text-blue-400 tracking-tight">{stats?.totalEnquiries || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10 border-l-4 border-l-green-500 bg-dark/40 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Reviews</h3>
          <p className="text-4xl font-extrabold text-green-400 tracking-tight">{stats?.pendingReviews || 0}</p>
        </div>
      </div>

      {/* Overview Chart */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-dark/40 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-6">Overview Statistics</h3>
        <div className="h-80 w-full">
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#181a20',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#F5A623' }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#F5A623" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-400 animate-pulse">Loading chart data...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Customer Directory Section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-dark/40 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Customer Directory</h3>
            <p className="text-xs text-gray-400 mt-0.5">Manage and search registered platform users</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={handleSearch}
              className="px-4 py-2 bg-dark/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all w-full md:w-64"
            />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-dark/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-all"
            >
              <option value="ALL" className="bg-dark text-white">All Roles</option>
              <option value="USER" className="bg-dark text-white">Customers</option>
              <option value="ADMIN" className="bg-dark text-white">Admins</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email / Phone</th>
                <th className="px-4 py-3 font-bold">Role</th>
                <th className="px-4 py-3 font-bold">Total Bookings</th>
                <th className="px-4 py-3 font-bold">Services Taken</th>
                <th className="px-4 py-3 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-bold text-white">{user.name}</td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-white">{user.email}</div>
                    <div className="text-[11px] text-gray-500">{user.phone || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-primary">{user.totalBookings || 0}</td>
                  <td className="px-4 py-4 font-semibold text-blue-400">{user.servicesTaken || 0}</td>
                  <td className="px-4 py-4 text-xs text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = AdminDashboardOverview;

