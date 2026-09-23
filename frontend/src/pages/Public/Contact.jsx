import React, { useEffect, useState } from 'react';
import { contactApi, enquiryApi } from "../../api/services";
import { useSearchParams } from "react-router";

export const PublicContact = () => {
  const [searchParams] = useSearchParams();
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', phone: '', subject: searchParams.get('subject') || '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    contactApi.getContact()
      .then(res => setContactInfo(res.data || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    enquiryApi.create(formData)
      .then(() => {
        setSuccess(true);
        setFormData({ name: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to send enquiry. Please try again.');
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) return <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xl font-semibold">Loading contact details...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16 font-sans">
      <div className="bg-brand-primary py-16 text-center border-b-4 border-brand-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <h1 className="text-4xl font-bold text-white mb-4 relative z-10">Contact Us</h1>
        <p className="text-slate-400 max-w-2xl mx-auto relative z-10">Get in touch with Nepal's leading diesel diagnostics and repair experts.</p>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-100 dark:border-slate-700 flex items-start space-x-6 hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none">
            <div className="text-4xl">📍</div>
            <div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Visit Our Workshop</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{contactInfo?.address || 'Brahma Chowk, Birgunj, Parsa, Nepal'}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-100 dark:border-slate-700 flex items-start space-x-6 hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none">
            <div className="text-4xl">📞</div>
            <div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Call Us Directly</h3>
              <p className="text-slate-700 dark:text-slate-200 text-lg font-bold">{contactInfo?.primaryPhone || '+977-9800000000'}</p>
              {contactInfo?.whatsapp && <p className="text-brand-accent font-bold text-sm mt-1">WhatsApp Available</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-100 dark:border-slate-700 flex items-start space-x-6 hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none">
            <div className="text-4xl">🕒</div>
            <div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Business Hours</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium">{contactInfo?.openingHours || 'Sunday - Friday: 9:00 AM - 6:00 PM'}</p>
              <p className="text-slate-400 text-sm mt-1 font-bold">Closed on Saturdays</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow dark:shadow-none-xl border-t-4 border-brand-accent">
           <h2 className="text-2xl font-bold text-brand-primary mb-6">Send an Enquiry</h2>
           
           {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 font-semibold">Thank you! Your enquiry has been successfully sent to our team.</div>}
           {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 font-semibold">{error}</div>}
           
           <form className="space-y-4" onSubmit={handleSubmit}>
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">Full Name</label>
               <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none transition-colors" required />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">Phone Number</label>
               <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none transition-colors" required />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">Subject</label>
               <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this regarding?" className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none transition-colors" required />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">Message</label>
               <textarea rows="4" name="message" value={formData.message} onChange={handleChange} className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none transition-colors min-h-[120px]" required></textarea>
             </div>
             <button type="submit" disabled={submitting} className="w-full bg-brand-primary text-brand-accent font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors shadow dark:shadow-none-lg disabled:opacity-50 text-lg uppercase tracking-wider mt-4">
               {submitting ? 'Sending...' : 'Submit Enquiry'}
             </button>
           </form>
        </div>
      </div>
    </div>
  );
};
