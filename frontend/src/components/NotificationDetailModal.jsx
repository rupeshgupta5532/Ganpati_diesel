import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Truck, MapPin, Calendar, Clock, Info } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const NotificationDetailModal = ({ notification, onClose, onStatusUpdate }) => {
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (!notification) return;

    const refId = notification.referenceId;
    if (refId) {
      setLoading(true);
      api.get(`/admin/bookings/${refId}`)
        .then(res => {
          const data = res.data?.data || res.data;
          setBookingDetail(data);
          if (data?.status) setCurrentStatus(data.status);
        })
        .catch(() => {
          api.get(`/bookings/${refId}`)
            .then(res => {
              const data = res.data?.data || res.data;
              setBookingDetail(data);
              if (data?.status) setCurrentStatus(data.status);
            })
            .catch(() => {
              console.log('Could not fetch booking details for refId:', refId);
            })
            .finally(() => setLoading(false));
        })
        .finally(() => setLoading(false));
    }
  }, [notification]);

  if (!notification) return null;

  const title = notification.title || 'Notification Details';
  const message = notification.message || '';
  const type = notification.type || 'ALERT';
  const dateStr = notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'N/A';
  const isOrder = type === 'NEW_ORDER' || message.toLowerCase().includes('order');

  const handleUpdateStatus = async (newStatus) => {
    if (!bookingDetail?._id) return;
    try {
      await api.patch(`/admin/bookings/${bookingDetail._id}/status`, { status: newStatus });
      setCurrentStatus(newStatus);
      setBookingDetail(prev => ({ ...prev, status: newStatus }));
      toast.success(`Booking status updated to ${newStatus}`);
      if (onStatusUpdate) onStatusUpdate(bookingDetail._id, newStatus);
    } catch(err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 space-y-6 text-gray-200 custom-scrollbar max-h-[90vh]"
        >
          {/* Top Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-primary/20 text-primary border border-primary/30 tracking-wider">
                  {type}
                </span>
                {currentStatus && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    currentStatus === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    currentStatus === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    currentStatus === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {currentStatus}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {title}
              </h2>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary/70" /> {dateStr}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6">
            {/* Notification Summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Summary Message
              </h4>
              <p className="text-sm text-gray-200 leading-relaxed">{message}</p>
            </div>

            {/* Detailed Booking / Order Specs */}
            {loading ? (
              <div className="p-8 text-center text-gray-400 animate-pulse font-medium">
                Fetching full details...
              </div>
            ) : bookingDetail ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 uppercase tracking-wider">
                  {isOrder ? 'Product Order Specs' : 'Service Booking Specs'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="bg-dark/50 border border-white/10 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Customer Info
                    </h4>
                    <p className="text-sm font-bold text-white">{bookingDetail.customerName || bookingDetail.userId?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-500" /> {bookingDetail.email || bookingDetail.userId?.email || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500" /> {bookingDetail.phone || bookingDetail.userId?.phone || 'N/A'}
                    </p>
                  </div>

                  {/* Item / Vehicle Info */}
                  <div className="bg-dark/50 border border-white/10 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-primary" /> {isOrder ? 'Ordered Items' : 'Vehicle & Service'}
                    </h4>
                    <p className="text-sm font-bold text-white">{bookingDetail.vehicleModel || bookingDetail.vehicleType || 'N/A'}</p>
                    {bookingDetail.vehicleType && (
                      <p className="text-xs text-gray-400">Category: {bookingDetail.vehicleType}</p>
                    )}
                    {bookingDetail.preferredDate && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-primary/70" /> Date: {new Date(bookingDetail.preferredDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description / Notes */}
                {bookingDetail.problemDescription && (
                  <div className="bg-dark/50 border border-white/10 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Description / Order Notes
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{bookingDetail.problemDescription}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            {bookingDetail?._id && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Update Status:</span>
                <select
                  value={currentStatus || 'PENDING'}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="bg-dark border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="PENDING" className="bg-dark text-yellow-400">PENDING</option>
                  <option value="CONFIRMED" className="bg-dark text-blue-400">CONFIRMED</option>
                  <option value="IN_PROGRESS" className="bg-dark text-purple-400">IN PROGRESS</option>
                  <option value="COMPLETED" className="bg-dark text-green-400">COMPLETED</option>
                  <option value="REJECTED" className="bg-dark text-red-400">REJECTED</option>
                </select>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
