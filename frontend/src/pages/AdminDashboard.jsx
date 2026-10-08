import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Navigation, MapPin, Phone, Mail, Truck, ChevronDown, Bell } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'PENDING', colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { value: 'CONFIRMED', label: 'ACCEPT', colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { value: 'REJECTED', label: 'REJECT', colorClass: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { value: 'IN_PROGRESS', label: 'IN PROGRESS', colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { value: 'COMPLETED', label: 'COMPLETED', colorClass: 'text-green-400 bg-green-500/10 border-green-500/20' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, usersRes, notifRes] = await Promise.all([
          api.get('/admin/bookings'),
          api.get('/admin/users'),
          api.get('/notifications')
        ]);
        setBookings(Array.isArray(bookingsRes) ? bookingsRes : (bookingsRes.data || []));
        setUsers(Array.isArray(usersRes) ? usersRes : (usersRes.data?.data || usersRes.data || []));
        setNotifications(Array.isArray(notifRes) ? notifRes : (notifRes.data?.data || notifRes.data || []));
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

  const updateBookingStatus = async (id, status) => {
    // Optimistic UI update
    const previousBookings = [...bookings];
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));

    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
    } catch (err) {
      console.error(err);
      setBookings(previousBookings); // Revert on failure
      toast.error('Failed to update booking status');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      toast.success('Booking deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete booking');
    }
  };

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-x-hidden flex flex-col">
      {/* Background blobs */}
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-20 pt-32 pb-48 px-4 max-w-7xl mx-auto w-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="h-8 w-8 text-primary" /> Admin Control Panel
            </h1>
            <p className="text-gray-400 mt-2">Manage platform bookings and user registry</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1e2128]"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-dark border border-white/10 shadow-2xl z-50 custom-scrollbar"
                    >
                      <div className="p-4 border-b border-white/10 sticky top-0 bg-dark/90 backdrop-blur-md flex justify-between items-center z-10">
                        <h3 className="font-bold text-white">Notifications</h3>
                        {notifications.length > 0 && (
                          <button 
                            onClick={async () => {
                              try {
                                await api.patch('/notifications/read-all');
                                setNotifications(notifications.map(n => ({...n, isRead: true})));
                              } catch(e) {}
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-400">No notifications yet</div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id} 
                              className={`p-3 rounded-xl transition-colors cursor-pointer ${notif.isRead ? 'opacity-70 hover:bg-white/5' : 'bg-primary/5 border border-primary/10 hover:bg-primary/10'}`}
                              onClick={async () => {
                                if(!notif.isRead) {
                                  try {
                                    await api.patch(`/notifications/${notif._id}/read`);
                                    setNotifications(notifications.map(n => n._id === notif._id ? {...n, isRead: true} : n));
                                  } catch(e) {}
                                }
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h4>
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">{new Date(notif.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className={`text-xs mt-1 ${notif.isRead ? 'text-gray-500' : 'text-gray-400'}`}>{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div className="relative flex-grow md:w-64">
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
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-visible flex-grow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div 
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
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
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading bookings...</td></tr>
                    ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                      <tr key={booking._id} className={`border-b border-white/5 hover:bg-white/5 transition-colors relative ${openDropdownId === booking._id ? 'z-50' : 'z-0'}`}>
                        <td className="px-4 py-4 font-medium text-white">#{booking._id.substring(booking._id.length - 6)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{booking.customerName || booking.userId?.name}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Mail className="h-3 w-3" />{booking.email || booking.userId?.email || 'N/A'}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{booking.phone || booking.userId?.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary/70"/> {booking.vehicleModel || booking.vehicleType || 'N/A'}</span>
                            {booking.vehicleType && <span className="text-xs text-gray-500 mt-1">{booking.vehicleType}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-1.5" title={booking.problemDescription}>
                            <MapPin className="h-4 w-4 text-primary/70"/> 
                            {booking.problemDescription ? (booking.problemDescription.length > 35 ? booking.problemDescription.substring(0, 35) + '...' : booking.problemDescription) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-1.5">
                            <Navigation className="h-4 w-4 text-primary/70"/> 
                            {new Date(booking.preferredDate || booking.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative inline-block">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === booking._id ? null : booking._id)}
                              className={`flex items-center justify-between w-36 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${STATUS_OPTIONS.find(s => s.value === booking.status)?.colorClass || 'text-gray-400 bg-white/5 border-white/10'}`}
                            >
                              {STATUS_OPTIONS.find(s => s.value === booking.status)?.label || booking.status}
                              <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${openDropdownId === booking._id ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                              {openDropdownId === booking._id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                  <motion.div 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute left-0 z-[9999] mt-2 w-40 rounded-xl bg-[#111827] border border-[#374151] shadow-2xl flex flex-col overflow-hidden"
                                  >
                                    <div className="py-2 flex flex-col w-full">
                                      {STATUS_OPTIONS.map((statusOption) => (
                                        <button
                                          key={statusOption.value}
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            updateBookingStatus(booking._id, statusOption.value);
                                            setOpenDropdownId(null);
                                          }}
                                          className={`w-full block text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                                            booking.status === statusOption.value 
                                              ? `${statusOption.colorClass.split(' ')[0]} bg-white/5` 
                                              : 'text-[#e5e7eb] hover:bg-white/10 hover:text-[#ffffff]'
                                          }`}
                                        >
                                          {statusOption.label}
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider font-bold transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-full"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-gray-500">No bookings found</td>
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
