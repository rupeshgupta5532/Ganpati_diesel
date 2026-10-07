import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Navigation, MapPin, Phone, Mail, Truck } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for Bookings
  const mockBookings = [
    { id: '101', name: 'John Doe', phone: '+1 (555) 123-4567', vehicle: '2022 Volvo FH16', location: 'Lat: 40.7128, Lng: -74.0060', date: '2026-10-01', status: 'Completed' },
    { id: '102', name: 'Sarah Smith', phone: '+1 (555) 987-6543', vehicle: '2019 Scania R500', location: 'Lat: 34.0522, Lng: -118.2437', date: '2026-10-04', status: 'Pending' },
    { id: '103', name: 'Mike Johnson', phone: '+1 (555) 555-5555', vehicle: '2020 Mercedes Actros', location: 'Lat: 41.8781, Lng: -87.6298', date: '2026-10-05', status: 'In Progress' },
  ];

  // Mock data for Users
  const mockUsers = [
    { id: 'U01', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', joined: '2025-01-15', totalBookings: 12, role: 'User' },
    { id: 'U02', name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1 (555) 987-6543', joined: '2026-03-22', totalBookings: 3, role: 'User' },
    { id: 'U03', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 (555) 555-5555', joined: '2026-08-10', totalBookings: 1, role: 'User' },
    { id: 'U04', name: 'Admin One', email: 'admin@diesel.com', phone: '+1 (555) 000-0000', joined: '2024-12-01', totalBookings: 0, role: 'Admin' },
  ];

  const filteredBookings = mockBookings.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.vehicle.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = mockUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

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
                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-medium text-white">#{booking.id}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-white">{booking.name}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{booking.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary/70"/> {booking.vehicle}</span></td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary/70"/> {booking.location.length > 25 ? booking.location.substring(0, 25) + '...' : booking.location}</span></td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Navigation className="h-4 w-4 text-primary/70"/> {booking.date}</span></td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                            booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
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
                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-xs text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs flex items-center gap-1.5"><Mail className="h-3 w-3" />{user.email}</span>
                            <span className="text-xs flex items-center gap-1.5"><Phone className="h-3 w-3" />{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 
                            'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4"><span className="flex items-center gap-1.5"><Navigation className="h-4 w-4 text-primary/70"/> {user.joined}</span></td>
                        <td className="px-4 py-4 text-center font-semibold text-white">
                          {user.totalBookings}
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
