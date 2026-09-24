import React, { useEffect, useState } from 'react';
import { adminReviewApi } from '../../api/adminApi';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    adminReviewApi.getAll()
      .then(res => setReviews(res.data.data || res.data))
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
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Manage Reviews</h1>
      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading reviews...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 border-b text-slate-600 dark:text-slate-300">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 w-1/3">Comment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review._id} className="border-b hover:bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">{review.userId?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 text-yellow-500 font-bold">{review.rating} / 5</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 italic">"{review.comment}"</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${review.status === 'APPROVED' ? 'bg-green-100 text-green-800' : review.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2 text-sm font-semibold">
                    {review.status !== 'APPROVED' && <button onClick={() => handleAction(review._id, 'approve')} className="text-green-600 hover:underline">Approve</button>}
                    {review.status !== 'REJECTED' && <button onClick={() => handleAction(review._id, 'reject')} className="text-red-600 hover:underline">Reject</button>}
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
