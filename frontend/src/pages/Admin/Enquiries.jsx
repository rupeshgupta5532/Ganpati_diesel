import React, { useEffect, useState } from 'react';
import { adminEnquiryApi } from '../../api/adminApi';

export const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = () => {
    setLoading(true);
    adminEnquiryApi.getAll()
      .then(res => setEnquiries(res.data?.data || res.data || []))
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
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Enquiries & Messages Inbox</h2>
        <p className="text-xs text-gray-400 mt-1">Direct contact form submissions and customer inquiries</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">No enquiries found.</div>
        ) : (
          enquiries.map(enquiry => (
            <div key={enquiry._id} className="bg-dark/40 border border-white/10 p-6 rounded-2xl border-l-4 border-l-primary flex flex-col md:flex-row justify-between gap-4 transition-colors hover:bg-white/5">
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2 flex-wrap">
                   <h3 className="text-lg font-bold text-white">{enquiry.subject || 'General Inquiry'}</h3>
                   <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full">{enquiry.status || 'NEW'}</span>
                 </div>
                 <p className="text-sm text-gray-300 mb-4 leading-relaxed">{enquiry.message}</p>
                 <div className="text-xs text-gray-400 flex items-center gap-4 flex-wrap">
                   <span>👤 <strong className="text-white">{enquiry.name}</strong></span>
                   <span>📞 {enquiry.phone || 'N/A'}</span>
                   <span>✉️ {enquiry.email || 'N/A'}</span>
                   <span>🕒 {new Date(enquiry.createdAt).toLocaleDateString()}</span>
                 </div>
               </div>
               <div className="flex items-center">
                 <select 
                   value={enquiry.status || 'NEW'}
                   onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                   className="border border-white/10 rounded-xl px-3 py-2 text-xs font-bold bg-[#111827] text-white focus:outline-none focus:border-primary cursor-pointer shadow-lg"
                 >
                   <option className="bg-[#111827] text-white" value="NEW">NEW</option>
                   <option className="bg-[#111827] text-white" value="CONTACTED">CONTACTED</option>
                   <option className="bg-[#111827] text-white" value="IN_PROGRESS">IN PROGRESS</option>
                   <option className="bg-[#111827] text-white" value="RESOLVED">RESOLVED</option>
                   <option className="bg-[#111827] text-white" value="CLOSED">CLOSED</option>
                 </select>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
