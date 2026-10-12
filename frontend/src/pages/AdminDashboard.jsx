import React, { useState, useEffect } from 'react';
import ThemeSwitch from '../components/ThemeSwitch';
import { useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Navigation, MapPin, Phone, Mail, Truck, ChevronDown, Bell, Trash2, 
  Package, Wrench, FolderGit2, Star, MessageSquare, Globe, PhoneCall, 
  LayoutDashboard, LogOut, Shield, Menu, X, Search, Activity, Sparkles, CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { NotificationDetailModal } from '../components/NotificationDetailModal';

import { AdminDashboardOverview } from './Admin/Dashboard';
import { AdminProducts } from './Admin/Products';
import { AdminServices } from './Admin/Services';
import { AdminProjects } from './Admin/Projects';
import { AdminReviews } from './Admin/Reviews';
import { AdminEnquiries } from './Admin/Enquiries';
import { AdminContent } from './Admin/Content';
import { AdminContact } from './Admin/Contact';
import { AdminAuditLogs } from './Admin/AuditLogs';

export const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  const getInitialTab = () => {
    const pathSegment = location.pathname.split('/')[2];
    if (['dashboard', 'overview', 'bookings', 'products', 'services', 'projects', 'reviews', 'enquiries', 'users', 'content', 'contact', 'audit-logs', 'audit'].includes(pathSegment)) {
      if (pathSegment === 'overview') return 'dashboard';
      if (pathSegment === 'audit') return 'audit-logs';
      return pathSegment;
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const pathSegment = location.pathname.split('/')[2];
    if (pathSegment && ['dashboard', 'overview', 'bookings', 'products', 'services', 'projects', 'reviews', 'enquiries', 'users', 'content', 'contact', 'audit-logs', 'audit'].includes(pathSegment)) {
      setActiveTab(pathSegment === 'overview' ? 'dashboard' : (pathSegment === 'audit' ? 'audit-logs' : pathSegment));
    }
  }, [location.pathname]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/admin/${tabName}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'PENDING', colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { value: 'CONFIRMED', label: 'ACCEPT', colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { value: 'REJECTED', label: 'REJECT', colorClass: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { value: 'IN_PROGRESS', label: 'IN PROGRESS', colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { value: 'COMPLETED', label: 'COMPLETED', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  ];

  const NAV_SECTIONS = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Navigation, badge: bookings.length > 0 ? bookings.length : null },
        { id: 'services', label: 'Services', icon: Wrench },
      ]
    },
    {
      title: 'INVENTORY & PORTFOLIO',
      items: [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
      ]
    },
    {
      title: 'ENGAGEMENT',
      items: [
        { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'users', label: 'Users', icon: User, badge: users.length > 0 ? users.length : null },
      ]
    },
    {
      title: 'PORTAL SETTINGS',
      items: [
        { id: 'content', label: 'Website CMS', icon: Globe },
        { id: 'contact', label: 'Contact Details', icon: PhoneCall },
        { id: 'audit-logs', label: 'Audit Logs', icon: Shield, badgeTag: 'LIVE' },
      ]
    }
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
    const previousBookings = [...bookings];
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));

    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
    } catch (err) {
      console.error(err);
      setBookings(previousBookings);
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

  const allItems = NAV_SECTIONS.flatMap(s => s.items);
  const currentTab = allItems.find(item => item.id === activeTab);
  const currentTabLabel = currentTab ? currentTab.label : 'Overview';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative flex overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Ambient background glow mesh */}
      <div className="blob blob-1 fixed opacity-15 pointer-events-none"></div>
      <div className="blob blob-2 fixed opacity-15 pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"></div>

      {/* Desktop Left Glass Sidebar */}
      <aside className="w-72 min-w-[18rem] bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between hidden lg:flex h-screen sticky top-0 z-30 select-none shadow-[5px_0_35px_rgba(0,0,0,0.5)]">
        {/* Top Brand Hologram Badge */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-emerald-400 to-secondary rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative w-11 h-11 rounded-2xl bg-black border border-white/15 flex items-center justify-center shadow-2xl">
                <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-br from-primary via-emerald-300 to-white">G</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black tracking-wider text-white">GANPATI DIESEL</h2>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-primary/20 text-primary border border-primary/30">SUITE</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ffa3]"></span>
                <span className="text-[10px] text-gray-400 font-mono tracking-tight truncate max-w-[150px]">
                  {authUser?.email || 'admin@ganpatidiesel.com'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categorized Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 no-scrollbar">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                {section.title}
              </div>
              <div className="space-y-1 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-white border border-primary/30 shadow-[0_0_20px_rgba(0,255,163,0.12)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Glowing Left Indicator Pill */}
                        <div className={`w-1 h-4 rounded-full transition-all duration-300 ${
                          isActive ? 'bg-primary shadow-[0_0_10px_#00ffa3] scale-y-100' : 'bg-transparent scale-y-0'
                        }`} />
                        <Icon className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(0,255,163,0.6)]' : 'text-gray-400 group-hover:text-gray-200'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Right Tags/Badges */}
                      {item.badgeTag && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/40 animate-pulse">
                          {item.badgeTag}
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-gray-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Live Diagnostics Widget & Logout */}
        <div className="p-3.5 border-t border-white/10 bg-gradient-to-t from-white/[0.02] to-transparent space-y-3">
          {/* System Health Card */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" /> System Mesh
              </span>
              <span className="text-[10px] text-primary font-mono font-bold">OPTIMAL</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full w-[98%]"></div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#050505]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between z-50 lg:hidden shadow-[10px_0_50px_rgba(0,0,0,0.8)] h-screen select-none"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black border border-white/15 flex items-center justify-center shadow-lg">
                    <span className="font-black text-lg text-primary">G</span>
                  </div>
                  <div>
                    <h2 className="text-xs font-black tracking-wider text-white">GANPATI DIESEL</h2>
                    <p className="text-[10px] text-gray-500 font-mono">{authUser?.role || 'ADMIN'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <div className="px-3 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                      {section.title}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleTabChange(item.id);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(0,255,163,0.15)]'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.badgeTag && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary">
                              {item.badgeTag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>End Session</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Top Frosted Glass Header */}
        <header className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb Section Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold hidden sm:inline">Admin Portal /</span>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-black text-white tracking-wide">
                  {currentTabLabel}
                </h1>
                <span className="w-2 h-2 rounded-full bg-primary/80 animate-ping hidden md:inline-block"></span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input with ⌘K Badge */}
            {(activeTab === 'bookings' || activeTab === 'users' || activeTab === 'dashboard') && (
              <div className="relative hidden md:flex items-center bg-dark/60 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-primary/50 transition-all w-56">
                <Search className="w-3.5 h-3.5 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Filter records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full"
                />
                <kbd className="hidden lg:inline-block text-[9px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 ml-1">
                  /
                </kbd>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeSwitch />

            {/* Glowing Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-primary/40 transition-all relative group"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_#00ffa3]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
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
                      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-dark/95 backdrop-blur-2xl border border-white/15 shadow-[0_15px_50px_rgba(0,0,0,0.8)] z-50 custom-scrollbar"
                    >
                      <div className="p-4 border-b border-white/10 sticky top-0 bg-dark/95 backdrop-blur-md flex justify-between items-center z-10">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/20 text-primary font-bold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="flex items-center gap-2.5">
                            <button 
                              onClick={async () => {
                                try {
                                  await api.patch('/notifications/read-all');
                                  setNotifications(notifications.map(n => ({...n, isRead: true})));
                                  toast.success('Marked all as read');
                                } catch(e) {}
                              }}
                              className="text-xs text-primary hover:underline font-semibold"
                            >
                              Mark read
                            </button>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const backup = [...notifications];
                                setNotifications([]);
                                try {
                                  await api.delete('/notifications');
                                  toast.success('Notifications cleared');
                                } catch(err) {
                                  try {
                                    await api.delete('/notifications/clear-all');
                                    toast.success('Notifications cleared');
                                  } catch(err2) {
                                    console.error(err2);
                                    setNotifications(backup);
                                    toast.error('Failed to clear notifications');
                                  }
                                }
                              }}
                              className="text-xs text-red-400 hover:text-red-300 p-1 rounded hover:bg-white/10 transition-colors"
                              title="Delete all notifications"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-500 font-mono">Zero unread notifications</div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id} 
                              className={`p-3 rounded-xl transition-all cursor-pointer group relative ${notif.isRead ? 'opacity-70 hover:bg-white/5' : 'bg-primary/10 border border-primary/20 hover:bg-primary/15'}`}
                              onClick={async () => {
                                setShowNotifications(false);
                                setSelectedNotif(notif);
                                if(!notif.isRead) {
                                  try {
                                    await api.patch(`/notifications/${notif._id}/read`);
                                    setNotifications(notifications.map(n => n._id === notif._id ? {...n, isRead: true} : n));
                                  } catch(e) {}
                                }
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 pr-6">
                                <h4 className={`text-xs font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h4>
                                <span className="text-[10px] text-gray-500 font-mono">{new Date(notif.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className={`text-xs mt-1 line-clamp-2 ${notif.isRead ? 'text-gray-500' : 'text-gray-300'}`}>{notif.message}</p>
                              
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const targetId = notif._id;
                                  setNotifications(prev => prev.filter(n => n._id !== targetId));
                                  try {
                                    await api.delete(`/notifications/${targetId}`);
                                    toast.success('Notification deleted');
                                  } catch(err) {
                                    console.error(err);
                                    toast.error('Failed to delete notification');
                                  }
                                }}
                                className="absolute top-2.5 right-2 text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-white/10 transition-colors z-20"
                                title="Delete notification"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Profile Pill & Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1 rounded-full bg-white/[0.04] border border-white/10 hover:border-primary/40 transition-all cursor-pointer group"
                title="Admin Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary via-emerald-400 to-secondary flex items-center justify-center text-black font-black text-xs shadow-md">
                  {(authUser?.name || authUser?.email || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left pr-2">
                  <div className="text-xs font-bold text-white leading-tight group-hover:text-primary transition-colors">
                    {authUser?.name || 'Administrator'}
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono tracking-wider">
                    {authUser?.role || 'ADMIN'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 mr-1 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-dark/95 backdrop-blur-2xl border border-white/15 shadow-[0_15px_50px_rgba(0,0,0,0.8)] z-50 p-4"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-black text-lg shadow-lg">
                          {(authUser?.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-white text-sm truncate">{authUser?.name || 'Admin User'}</h4>
                          <p className="text-xs text-gray-400 truncate font-mono">{authUser?.email || 'admin@ganpatidiesel.com'}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                            {authUser?.role || 'ADMIN'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition-all"
                        >
                          <LogOut className="w-4 h-4" /> End Current Session
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Viewport */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="w-full"
              >
                <AdminDashboardOverview />
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminServices />
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminProducts />
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminProjects />
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div 
                key="bookings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="w-full space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                      <Navigation className="h-6 w-6 text-primary" /> Bookings Management
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Real-time status updates and fleet dispatch records</p>
                  </div>
                  <div className="md:hidden">
                    <input 
                      type="text" 
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-dark/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl relative overflow-visible">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                      <thead className="text-xs text-gray-400 uppercase bg-dark/60 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3.5 font-bold">ID</th>
                          <th className="px-4 py-3.5 font-bold">Customer</th>
                          <th className="px-4 py-3.5 font-bold">Vehicle</th>
                          <th className="px-4 py-3.5 font-bold">Location</th>
                          <th className="px-4 py-3.5 font-bold">Date</th>
                          <th className="px-4 py-3.5 font-bold">Status</th>
                          <th className="px-4 py-3.5 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="7" className="text-center py-12 text-gray-500 font-mono">Retrieving fleet bookings...</td></tr>
                        ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                          <tr key={booking._id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors relative ${openDropdownId === booking._id ? 'z-50' : 'z-0'}`}>
                            <td className="px-4 py-4 font-mono font-bold text-primary">#{booking._id.substring(booking._id.length - 6)}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="text-white font-semibold">{booking.customerName || booking.userId?.name || 'Customer'}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{booking.customerPhone || booking.userId?.phone || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary/70"/> {booking.vehicleModel || booking.vehicleType || 'Not specified'}</span></td>
                            <td className="px-4 py-4"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary/70"/> {(booking.location || 'N/A').length > 25 ? (booking.location || '').substring(0, 25) + '...' : booking.location}</span></td>
                            <td className="px-4 py-4"><span className="flex items-center gap-1.5 font-mono text-xs"><Navigation className="h-4 w-4 text-primary/70"/> {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</span></td>
                            <td className="px-4 py-4">
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(openDropdownId === booking._id ? null : booking._id);
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                                    STATUS_OPTIONS.find(o => o.value === booking.status)?.colorClass || 'text-gray-400 bg-gray-500/10 border-gray-500/20'
                                  }`}
                                >
                                  <span>{STATUS_OPTIONS.find(o => o.value === booking.status)?.label || booking.status}</span>
                                  <ChevronDown className="h-3 w-3" />
                                </button>

                                <AnimatePresence>
                                  {openDropdownId === booking._id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenDropdownId(null);
                                        }}
                                      ></div>
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-2 w-36 rounded-2xl bg-dark/95 backdrop-blur-xl border border-white/20 shadow-2xl z-50 overflow-hidden"
                                      >
                                        <div className="py-1">
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
                                                  ? `${statusOption.colorClass.split(' ')[0]} bg-white/10` 
                                                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
                                className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-full border border-red-500/20"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-gray-500">No matching bookings found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'enquiries' && (
              <motion.div key="enquiries" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminEnquiries />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminReviews />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="w-full space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                      <User className="h-6 w-6 text-primary" /> User Registry
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Platform customer accounts, role mappings and security clearances</p>
                  </div>
                  <div className="md:hidden">
                    <input 
                      type="text" 
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-dark/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl relative overflow-visible">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                      <thead className="text-xs text-gray-400 uppercase bg-dark/60 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3.5 font-bold">User</th>
                          <th className="px-4 py-3.5 font-bold">Contact</th>
                          <th className="px-4 py-3.5 font-bold">Role</th>
                          <th className="px-4 py-3.5 font-bold">Joined Date</th>
                          <th className="px-4 py-3.5 font-bold text-center">Total Bookings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="5" className="text-center py-12 text-gray-500 font-mono">Loading user registry...</td></tr>
                        ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                          <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                                  {(user.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{user.name}</div>
                                  <div className="text-xs text-gray-500 font-mono">ID: {user._id.substring(user._id.length - 6)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs flex items-center gap-1.5"><Mail className="h-3 w-3 text-gray-400" />{user.email}</span>
                                <span className="text-xs flex items-center gap-1.5"><Phone className="h-3 w-3 text-gray-400" />{user.phone || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? 'bg-secondary/15 text-secondary border border-secondary/30' : 
                                'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-4"><span className="flex items-center gap-1.5 font-mono text-xs"><Navigation className="h-4 w-4 text-primary/70"/> {new Date(user.createdAt || user.joined).toLocaleDateString()}</span></td>
                            <td className="px-4 py-4 text-center font-mono font-bold text-white">
                              {user.totalBookings !== undefined ? user.totalBookings : '-'}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5" className="text-center py-12 text-gray-500">No users found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminContent />
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div key="contact" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminContact />
              </motion.div>
            )}

            {activeTab === 'audit-logs' && (
              <motion.div key="audit-logs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <AdminAuditLogs />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Centered Modal for Full Notification & Booking Details */}
      <NotificationDetailModal 
        notification={selectedNotif} 
        onClose={() => setSelectedNotif(null)} 
        onStatusUpdate={(id, newStatus) => {
          setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        }}
      />
    </div>
  );
};
