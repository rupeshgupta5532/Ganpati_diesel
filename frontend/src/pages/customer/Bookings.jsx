import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { bookingApi } from '../../api/bookingApi';
import { reviewApi } from '../../api/services';

const ReviewModal = ({ bookingId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    reviewApi.create({ bookingId, rating, comment })
      .then(() => {
        onSuccess();
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to submit review');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Write a Review</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-300 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">How would you rate our service?</label>
              <div className="flex space-x-2 text-3xl">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)} 
                    className={`focus:outline-none transition-colors ${rating >= star ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-200'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Your Feedback</label>
              <textarea 
                rows="4" 
                required 
                value={comment} 
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full border border-slate-200 dark:border-slate-600 rounded p-3 focus:ring focus:ring-brand-accent/30 focus:border-brand-accent outline-none"
              ></textarea>
            </div>
            <div className="pt-2 flex space-x-3">
               <button type="submit" disabled={loading} className="flex-1 bg-brand-primary text-brand-accent font-bold py-3 rounded hover:bg-slate-800 transition-colors uppercase text-sm tracking-wider">
                 {loading ? 'Submitting...' : 'Submit Review'}
               </button>
               <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded hover:bg-slate-200 transition-colors uppercase text-sm tracking-wider">
                 Cancel
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    bookingApi.getMyBookings()
      .then(res => setBookings(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const filteredBookings = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 font-sans">
      <div className="flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-600 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-primary dark:text-slate-100">My Bookings History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Track the status of your vehicle repairs and part replacements.</p>
        </div>
        <Link to="/book-service" className="bg-brand-accent text-brand-primary font-bold px-6 py-2.5 rounded shadow dark:shadow-none hover:bg-yellow-400 transition-colors">
          + New Request
        </Link>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors tracking-wide ${filter === status ? 'bg-brand-primary text-white shadow dark:shadow-none-md dark:shadow dark:shadow-none-none' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:bg-slate-900'}`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 dark:text-slate-400 font-bold">Loading your history...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-100 dark:border-slate-700">
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-4">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-100 dark:border-slate-700 border-l-4 border-l-brand-primary flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{booking.vehicleType} - {booking.vehicleModel}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider
                    ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-2 font-medium"><span className="font-bold text-slate-800 dark:text-slate-100">Problem:</span> {booking.problemDescription}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 inline-block px-2 py-1 rounded border border-slate-100 dark:border-slate-700">Requested: {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime || 'N/A'}</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col space-y-3 min-w-[140px]">
                <Link to={`/bookings/${booking._id}`} className="bg-brand-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800 text-center tracking-wide transition-colors">
                  View Timeline
                </Link>
                {booking.status === 'COMPLETED' && (
                  <button onClick={() => setReviewingId(booking._id)} className="text-brand-primary text-sm font-bold hover:text-blue-600 transition-colors flex items-center justify-center space-x-1">
                    <span>⭐</span>
                    <span className="underline decoration-2 underline-offset-2">Write a Review</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {reviewingId && (
        <ReviewModal 
          bookingId={reviewingId} 
          onClose={() => setReviewingId(null)} 
          onSuccess={() => {
            alert("Thank you! Your review has been submitted for moderation.");
            setReviewingId(null);
          }} 
        />
      )}
    </div>
  );
};
