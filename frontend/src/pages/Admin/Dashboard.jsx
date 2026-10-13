import React, { useEffect, useState } from 'react';
import { dashboardApi, adminUserApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [directoryTab, setDirectoryTab] = useState('customers'); // 'customers' | 'admins'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAggregations()
      .then(res => {
        const payload = res.data || res;
        setStats({
          totalBookings: payload.bookings?.total || 0,
          pendingBookings: payload.bookings?.pending || 0,
          totalEnquiries: payload.enquiries?.total || 0,
          pendingReviews: payload.reviews?.pending || 0,
          totalUsers: payload.users?.total || 0,
          totalAdmins: payload.admins?.total || 0,
        });
      })
      .catch(console.error);
  }, []);
  
  useEffect(() => {
    fetchAllDirectoryData();
  }, []);

  const fetchAllDirectoryData = (searchQuery = '') => {
    setLoading(true);
    Promise.all([
      adminUserApi.getCustomers(searchQuery),
      adminUserApi.getAdmins(searchQuery),
    ])
      .then(([customersRes, adminsRes]) => {
        setCustomers(customersRes.data?.data || customersRes.data || []);
        setAdmins(adminsRes.data?.data || adminsRes.data || []);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load directory data');
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchAllDirectoryData(val);
  };

  const filteredCustomers = customers.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredAdmins = admins.filter(a => 
    (a.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (a.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Operations Overview</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time business performance metrics, customer bookings and administrator registry</p>
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
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Registered Customers</h3>
          <p className="text-4xl font-extrabold text-blue-400 tracking-tight">{stats?.totalUsers || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10 border-l-4 border-l-purple-500 bg-dark/40 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform Admins</h3>
          <p className="text-4xl font-extrabold text-purple-400 tracking-tight">{stats?.totalAdmins || 0}</p>
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
                  { name: 'Customers', count: stats.totalUsers },
                  { name: 'Admins', count: stats.totalAdmins },
                  { name: 'Total Bookings', count: stats.totalBookings },
                  { name: 'Pending Bookings', count: stats.pendingBookings },
                  { name: 'Total Enquiries', count: stats.totalEnquiries },
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
      
      {/* Separated Directory Section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-dark/40 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">
                {directoryTab === 'customers' ? 'Customer Directory' : 'Administrator Directory'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                directoryTab === 'customers' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {directoryTab === 'customers' ? `${filteredCustomers.length} Users` : `${filteredAdmins.length} Admins`}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {directoryTab === 'customers' 
                ? 'Registered client accounts, contact details and service orders' 
                : 'Platform administrators, management clearance and authorized staff'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Dedicated Tabs for Separation */}
            <div className="flex bg-dark/80 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setDirectoryTab('customers')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  directoryTab === 'customers'
                    ? 'bg-primary text-black shadow-lg shadow-primary/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>Customers</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  directoryTab === 'customers' ? 'bg-black/20 text-black font-extrabold' : 'bg-white/10 text-gray-300'
                }`}>
                  {customers.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDirectoryTab('admins')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  directoryTab === 'admins'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>Administrators</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  directoryTab === 'admins' ? 'bg-white/20 text-white font-extrabold' : 'bg-white/10 text-gray-300'
                }`}>
                  {admins.length}
                </span>
              </button>
            </div>

            <input 
              type="text" 
              placeholder={directoryTab === 'customers' ? "Search customers..." : "Search admins..."} 
              value={search}
              onChange={handleSearch}
              className="px-4 py-2 bg-dark/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all w-full md:w-56"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          {directoryTab === 'customers' ? (
            /* Customers Table */
            <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
              <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-bold">Customer</th>
                  <th className="px-4 py-3 font-bold">Email / Phone</th>
                  <th className="px-4 py-3 font-bold">Account Role</th>
                  <th className="px-4 py-3 font-bold">Total Bookings</th>
                  <th className="px-4 py-3 font-bold">Services Taken</th>
                  <th className="px-4 py-3 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 font-mono">Loading customers...</td>
                  </tr>
                ) : filteredCustomers.length > 0 ? filteredCustomers.map(user => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">ID: {user._id.substring(user._id.length - 6)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-medium text-white">{user.email}</div>
                      {user.phone ? (
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">📞 {user.phone}</div>
                      ) : (
                        <div className="text-[11px] text-gray-500 italic mt-0.5">No phone number</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        CUSTOMER
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
          ) : (
            /* Administrators Table */
            <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
              <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-bold">Administrator</th>
                  <th className="px-4 py-3 font-bold">Email / Phone</th>
                  <th className="px-4 py-3 font-bold">Access Role</th>
                  <th className="px-4 py-3 font-bold">Clearance</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 font-mono">Loading administrators...</td>
                  </tr>
                ) : filteredAdmins.length > 0 ? filteredAdmins.map(admin => (
                  <tr key={admin._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{admin.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">ID: {admin._id.substring(admin._id.length - 6)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-medium text-white">{admin.email}</div>
                      {admin.phone ? (
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">📞 {admin.phone}</div>
                      ) : (
                        <div className="text-[11px] text-gray-500 italic mt-0.5">No phone number</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {admin.role || 'ADMIN'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        FULL ACCESS
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        admin.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {admin.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No administrators found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = AdminDashboardOverview;

