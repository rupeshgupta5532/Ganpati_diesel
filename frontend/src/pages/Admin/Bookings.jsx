import React, { useEffect, useState } from 'react';
import { adminBookingApi } from '../../api/adminApi';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
        <h1 className="text-3xl font-bold text-brand-primary">Booking Management</h1>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6 font-semibold border-l-4 border-red-500">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-brand-border/20 dark:border-brand-border/80 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">No bookings found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-brand-border/10 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Vehicle</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/5">
              {bookings.map(booking => (
                <tr key={booking._id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-200 whitespace-nowrap font-medium">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-brand-primary">{booking.customerName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{booking.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-200">
                    <div className="font-semibold">{booking.vehicleType}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{booking.vehicleModel}</div>
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none font-semibold cursor-pointer shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <button 
                      onClick={() => openNotesModal(booking)}
                      className="text-brand-accent font-bold hover:text-brand-accent-hover hover:underline transition-colors"
                    >
                      View Notes
                    </button>
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Issue Description</label>
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedBooking.problemDescription || <span className="italic text-slate-400">No issue described by customer.</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 mt-4">Internal Admin Notes</label>
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
                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:bg-slate-900 transition-colors"
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
