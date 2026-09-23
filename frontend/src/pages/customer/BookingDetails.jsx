import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { bookingApi } from '../../api/bookingApi';

export const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bookingApi.getBookingDetails(id)
      .then(res => setBooking(res.data || res))
      .catch(err => setError(err.message || 'Failed to load details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading timeline details...</div>;
  if (error || !booking) return <div className="p-12 text-center text-red-500 bg-red-50">{error || 'Booking not found'}</div>;

  const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
  let currentStep = statuses.indexOf(booking.status);
  
  if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
    currentStep = -1; // Specialized state
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 font-sans">
      <Link to="/bookings" className="text-blue-600 hover:underline mb-6 inline-block font-semibold">← Back to My Bookings</Link>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow dark:shadow-none-lg border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-primary">{booking.vehicleModel} ({booking.vehicleType})</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Booking ID: {booking._id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider
            ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
              booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
              booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
              'bg-blue-100 text-blue-700'}`}>
            {booking.status}
          </span>
        </div>

        {/* Timeline Visualization */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b pb-2">Service Timeline</h2>
          {currentStep === -1 ? (
            <div className="bg-red-50 p-6 rounded border-l-4 border-red-500">
              <h3 className="font-bold text-red-700">Booking {booking.status}</h3>
              <p className="text-red-600 mt-1">This request was cancelled or rejected.</p>
              {booking.adminNotes && <p className="text-red-800 font-semibold mt-2">Note: {booking.adminNotes}</p>}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-200"></div>
              <ul className="space-y-8 relative z-10">
                {statuses.map((status, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <li key={status} className="flex items-start">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow dark:shadow-none
                        ${isCompleted ? 'bg-brand-accent text-white' : 'bg-slate-200 text-slate-400'}
                        ${isCurrent ? 'ring-4 ring-brand-accent/30' : ''}
                      `}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className="ml-6 mt-1">
                        <h3 className={`font-bold ${isCompleted ? 'text-brand-primary' : 'text-slate-400'}`}>
                          {status.replace('_', ' ')}
                        </h3>
                        {status === 'PENDING' && <p className="text-sm text-slate-500 dark:text-slate-400">Request submitted on {new Date(booking.createdAt).toLocaleDateString()}</p>}
                        {status === 'CONFIRMED' && isCompleted && <p className="text-sm text-slate-500 dark:text-slate-400">Service center has acknowledged and approved the booking.</p>}
                        {status === 'IN_PROGRESS' && isCompleted && <p className="text-sm text-slate-500 dark:text-slate-400">Your vehicle/parts are currently being serviced by our engineers.</p>}
                        {status === 'COMPLETED' && isCompleted && <p className="text-sm text-green-600 font-bold mt-1">Ready for pickup/delivery!</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-900 p-6 rounded">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Service Details</h3>
            <p className="font-semibold text-brand-primary">{booking.serviceId?.name || 'General Repair / Custom'}</p>
            <p className="text-slate-600 dark:text-slate-300 mt-2"><span className="font-semibold">Reported Issue:</span> {booking.problemDescription}</p>
            <p className="text-slate-600 dark:text-slate-300 mt-2"><span className="font-semibold">Preferred Date:</span> {new Date(booking.preferredDate).toLocaleDateString()}</p>
          </div>
          
          <div>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Notes / Output</h3>
             <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-600 rounded min-h-[100px]">
               {booking.adminNotes ? (
                 <p className="text-brand-primary whitespace-pre-wrap">{booking.adminNotes}</p>
               ) : (
                 <p className="text-slate-400 italic">No notes have been added by the engineering team yet.</p>
               )}
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
