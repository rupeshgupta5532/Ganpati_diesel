import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DeleteButton from '../components/DeleteButton';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Truck, MapPin, Navigation, ArrowRight } from 'lucide-react';

export const BookService = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    location: ''
  });
  
  const [bookings, setBookings] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setFormData(prev => ({ ...prev, location: "Location access denied" }));
          setLocationLoading(false);
        }
      );
    } else {
      setFormData(prev => ({ ...prev, location: "Geolocation not supported" }));
      setLocationLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.vehicle) return;
    
    const newBooking = {
      id: Date.now().toString(),
      ...formData,
      status: 'Pending',
      date: new Date().toLocaleDateString()
    };
    
    setBookings(prev => [newBooking, ...prev]);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicle: '',
      location: ''
    });
  };

  const handleDelete = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-x-hidden flex flex-col">
      {/* Background blobs */}
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-12">
        
        {/* Booking Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 w-full"
        >
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <h1 className="text-3xl font-bold mb-2 text-white">Initialize Service</h1>
            <p className="text-gray-400 text-sm mb-8">Enter your vehicle diagnostics and network location to request a mechanic slot.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">User Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    placeholder="Enter your full name" 
                    className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input 
                      type="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder="name@email.com" 
                      className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input 
                      type="tel" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Vehicle Details</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Truck className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" name="vehicle" required
                    value={formData.vehicle} onChange={handleChange}
                    placeholder="e.g. 2019 Tata Signa 4923.S" 
                    className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Share Location</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input 
                      type="text" name="location" required
                      value={formData.location} onChange={handleChange}
                      placeholder="Enter address or share location..." 
                      className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl flex items-center justify-center transition-colors text-primary"
                    title="Get Current Location"
                  >
                    <Navigation className={`h-5 w-5 ${locationLoading ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-black font-semibold rounded-xl py-3.5 text-sm flex justify-center items-center gap-2 transition-all group mt-6">
                Submit Protocol <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Live Bookings Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 w-full flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <h2 className="text-xl font-semibold text-white">Active Service Requests</h2>
          </div>

          <div className="flex-grow space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {bookings.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-white/5 text-center text-gray-500 flex flex-col items-center justify-center h-48">
                <Truck className="h-8 w-8 mb-3 opacity-20" />
                <p>No active requests in the network.</p>
              </div>
            ) : (
              <AnimatePresence>
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    className="glass rounded-2xl p-5 border border-white/10 flex justify-between items-center relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{booking.vehicle}</h3>
                      <div className="text-xs text-gray-400 mt-1 flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {booking.name} ({booking.phone})</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary/70" /> {booking.location}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {/* The user's requested Custom Delete Button */}
                      <DeleteButton onClick={() => handleDelete(booking.id)} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
