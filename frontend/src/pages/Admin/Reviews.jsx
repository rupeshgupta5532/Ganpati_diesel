import React, { useEffect, useState } from 'react';
import { adminReviewApi } from '../../api/adminApi';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    adminReviewApi.getAll()
      .then(res => setReviews(res.data?.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = (id, action) => {
    if (window.confirm(`Are you sure you want to ${action} this review?`)) {
       const request = action === 'approve' ? adminReviewApi.approve(id) : adminReviewApi.reject(id);
       request.then(fetchReviews).catch(err => alert(`Failed to ${action} review`));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Customer Reviews</h2>
        <p className="text-xs text-gray-400 mt-1">Approve or reject testimonials submitted by clients</p>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No reviews found.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Rating</th>
                <th className="py-3.5 px-4 font-semibold w-1/3">Comment</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{review.userId?.name || review.name || 'Anonymous'}</td>
                  <td className="py-3.5 px-4 text-primary font-bold">{review.rating} / 5 ★</td>
                  <td className="py-3.5 px-4 text-xs text-gray-300 italic whitespace-normal max-w-xs">"{review.comment || review.text}"</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${review.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : review.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {review.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {review.status !== 'APPROVED' && (
                        <button onClick={() => handleAction(review._id, 'approve')} className="text-green-400 hover:text-green-300 text-xs uppercase font-bold tracking-wider bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-full transition-colors">
                          Approve
                        </button>
                      )}
                      {review.status !== 'REJECTED' && (
                        <button onClick={() => handleAction(review._id, 'reject')} className="text-red-400 hover:text-red-300 text-xs uppercase font-bold tracking-wider bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-full transition-colors">
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
