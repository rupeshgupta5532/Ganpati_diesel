import React, { useEffect, useState } from 'react';
import { reviewApi } from '../../api/services';

export const PublicReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewApi.getAll()
      .then(res => setReviews(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xl">Loading customer feedback...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16">
      <div className="bg-slate-900 py-16 text-center border-b-4 border-blue-600">
        <h1 className="text-4xl font-bold text-white mb-4">What Our Customers Say</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Real reviews from our satisfied clients across Nepal.</p>
      </div>
      
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.length === 0 ? (
             <div className="col-span-3 text-center text-slate-500 dark:text-slate-400 py-10">No reviews published yet.</div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col h-full relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 rounded-t-lg"></div>
                <div className="flex items-center space-x-1 mb-4 text-yellow-400 text-xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-200 italic flex-1 mb-6">"{review.comment}"</p>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{review.userId?.name || 'Customer'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
