import React, { useEffect, useState } from 'react';
import { adminEnquiryApi } from '../../api/adminApi';

export const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = () => {
    setLoading(true);
    adminEnquiryApi.getAll()
      .then(res => setEnquiries(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = (id, status) => {
    adminEnquiryApi.update(id, { status })
      .then(fetchEnquiries)
      .catch(err => alert('Failed to update enquiry status.'));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Enquiries Inbox</h1>
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 text-center text-gray-500 dark:text-slate-400 rounded shadow dark:shadow-none">No enquiries found.</div>
        ) : (
          enquiries.map(enquiry => (
            <div key={enquiry._id} className="bg-white dark:bg-slate-800 p-6 rounded shadow dark:shadow-none border-l-4 border-blue-500 flex flex-col md:flex-row justify-between">
               <div className="flex-1">
                 <div className="flex items-center space-x-3 mb-2">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{enquiry.subject}</h3>
                   <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">{enquiry.status}</span>
                 </div>
                 <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{enquiry.message}</p>
                 <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-4">
                   <span>👤 {enquiry.name}</span>
                   <span>📞 {enquiry.phone}</span>
                   <span>🕒 {new Date(enquiry.createdAt).toLocaleDateString()}</span>
                 </div>
               </div>
               <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-center">
                 <select 
                   value={enquiry.status}
                   onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                   className="border rounded p-2 text-sm bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                 >
                   <option value="NEW">NEW</option>
                   <option value="CONTACTED">CONTACTED</option>
                   <option value="IN_PROGRESS">IN_PROGRESS</option>
                   <option value="RESOLVED">RESOLVED</option>
                   <option value="CLOSED">CLOSED</option>
                 </select>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
