import React, { useEffect, useState } from 'react';
import { adminBookingApi } from '../../api/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'PENDING', colorClass: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20' },
    { value: 'CONFIRMED', label: 'CONFIRMED', colorClass: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20' },
    { value: 'IN_PROGRESS', label: 'IN PROGRESS', colorClass: 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20' },
    { value: 'COMPLETED', label: 'COMPLETED', colorClass: 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20' },
    { value: 'CANCELLED', label: 'CANCELLED', colorClass: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20' },
    { value: 'REJECTED', label: 'REJECTED', colorClass: 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-500/10 dark:border-gray-500/20' }
  ];

  // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    adminBookingApi.getAll()
      .then(res => setBookings(res.data || res))
      .catch(err => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`Change status to ${newStatus}? This will notify the customer.`)) {
      adminBookingApi.updateStatus(id, newStatus)
        .then(() => fetchBookings())
        .catch(err => alert('Failed to update status'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking request? This action cannot be undone.')) {
      adminBookingApi.delete(id)
        .then(() => {
          setBookings(bookings.filter(b => b._id !== id));
        })
        .catch(err => alert('Failed to delete booking'));
    }
  };

  const openNotesModal = (booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.adminNotes || '');
  };

  const closeNotesModal = () => {
    setSelectedBooking(null);
    setAdminNotes('');
  };

  const saveNotes = () => {
    setSavingNotes(true);
    adminBookingApi.updateNotes(selectedBooking._id, adminNotes)
      .then(() => {
        setBookings(bookings.map(b => b._id === selectedBooking._id ? { ...b, adminNotes } : b));
        closeNotesModal();
      })
      .catch(() => alert('Failed to save notes'))
      .finally(() => setSavingNotes(false));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">Booking Management</h1>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6 font-semibold border-l-4 border-red-500">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-brand-border/20 dark:border-brand-border/80 overflow-visible min-h-[400px]">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">No bookings found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-brand-border/10 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Date & Time</th>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Vehicle</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/5">
              {bookings.map(booking => (
                <tr key={booking._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900 transition-colors text-slate-800 dark:text-slate-200 relative ${openDropdownId === booking._id ? 'z-50' : 'z-10'}`}>
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-200 whitespace-nowrap font-medium">
                    {new Date(booking.preferredDate).toLocaleDateString()}<br/><span className="text-sm text-slate-500">{booking.preferredTime || 'N/A'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-brand-primary">{booking.customerName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{booking.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-200">
                    <div className="font-semibold">{booking.vehicleType}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{booking.vehicleModel}</div>
                  </td>
                  <td className="py-4 px-6 relative overflow-visible" style={{ position: 'relative' }}>
                    {(() => {
                      const currentStatus = STATUS_OPTIONS.find(opt => opt.value === booking.status) || STATUS_OPTIONS[0];
                      return (
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === booking._id ? null : booking._id)}
                            className={`flex items-center justify-between w-36 px-3 py-1.5 rounded-full text-xs font-bold border ${currentStatus.colorClass} hover:opacity-80 transition-opacity`}
                          >
                            {currentStatus.label}
                            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdownId === booking._id ? 'rotate-180' : ''}`} />
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
                                  className="absolute left-0 z-[9999] mt-2 w-40 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#374151] shadow-2xl flex flex-col overflow-hidden"
                                >
                                  <div className="py-2 flex flex-col w-full">
                                    {STATUS_OPTIONS.map((statusOption) => (
                                      <button
                                        key={statusOption.value}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleStatusChange(booking._id, statusOption.value);
                                          setOpenDropdownId(null);
                                        }}
                                        className={`w-full block text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                                          booking.status === statusOption.value 
                                            ? `${statusOption.colorClass.split(' ')[0]} bg-gray-100 dark:bg-white/5` 
                                            : 'text-gray-700 dark:text-[#e5e7eb] hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:text-[#ffffff]'
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
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => openNotesModal(booking)}
                        className="text-brand-accent font-bold hover:text-brand-accent-hover hover:underline transition-colors"
                      >
                        View Notes
                      </button>
                      <button 
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-500 font-bold hover:text-red-700 hover:underline transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Notes Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="bg-brand-primary px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Booking Details & Notes</h2>
              <button onClick={closeNotesModal} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 text-slate-800 dark:text-slate-200">Customer Issue Description</label>
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedBooking.problemDescription || <span className="italic text-slate-400">No issue described by customer.</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 mt-4 text-slate-800 dark:text-slate-200">Internal Admin Notes</label>
                <textarea 
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add diagnosis, parts used, or mechanic notes here. The customer can see this on their timeline."
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-4 focus:border-brand-accent focus:ring-0 outline-none transition-colors min-h-[120px]"
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
              <button 
                onClick={closeNotesModal} 
                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveNotes} 
                disabled={savingNotes}
                className="px-6 py-2.5 rounded-lg font-bold text-brand-primary bg-brand-accent hover:bg-brand-accent-hover transition-colors shadow dark:shadow-none-lg shadow dark:shadow-none-brand-accent/20 disabled:opacity-50"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
