import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Navigation, MapPin, Phone, Mail, Truck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, usersRes] = await Promise.all([
          api.get('/admin/bookings'),
          api.get('/admin/users')
        ]);
        setBookings(Array.isArray(bookingsRes) ? bookingsRes : (bookingsRes.data || []));
        // /admin/users might return paginated data e.g. { data: [...], total: ... }
        setUsers(Array.isArray(usersRes) ? usersRes : (usersRes.data?.data || usersRes.data || []));
      } catch (err) {
        console.error('Error fetching admin data:', err);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredBookings = bookings.filter(b => 
    (b.customerName || b.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.vehicleModel || b.vehicleType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-x-hidden flex flex-col">
      {/* Background blobs */}
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="h-8 w-8 text-primary" /> Admin Control Panel
            </h1>
            <p className="text-gray-400 mt-2">Manage platform bookings and user registry</p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Navigation className="h-4 w-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Navigation className="h-5 w-5" /> Bookings
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'users' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <User className="h-5 w-5" /> Users
          </button>
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden flex-grow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div 
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                  <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading bookings...</td></tr>
                    ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-medium text-white">#{booking._id.substring(booking._id.length - 6)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-white">{booking.customerName || booking.userId?.name}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{booking.phone || booking.userId?.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary/70"/> {booking.vehicleModel || booking.vehicleType || 'N/A'}</span></td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary/70"/> {booking.problemDescription ? (booking.problemDescription.length > 25 ? booking.problemDescription.substring(0, 25) + '...' : booking.problemDescription) : 'N/A'}</span></td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Navigation className="h-4 w-4 text-primary/70"/> {new Date(booking.preferredDate || booking.createdAt).toLocaleDateString()}</span></td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                            booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-500">No bookings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                  <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Joined Date</th>
                      <th className="px-4 py-3 text-center">Total Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading users...</td></tr>
                    ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                              {(user.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-xs text-gray-500">ID: {user._id.substring(user._id.length - 6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs flex items-center gap-1.5"><Mail className="h-3 w-3" />{user.email}</span>
                            <span className="text-xs flex items-center gap-1.5"><Phone className="h-3 w-3" />{user.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? 'bg-secondary/10 text-secondary border border-secondary/20' : 
                            'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Navigation className="h-4 w-4 text-primary/70"/> {new Date(user.createdAt || user.joined).toLocaleDateString()}</span></td>
                        <td className="px-4 py-4 text-center font-semibold text-white">
                          {user.totalBookings !== undefined ? user.totalBookings : '-'}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
