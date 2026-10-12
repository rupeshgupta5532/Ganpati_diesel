import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { contactApi, enquiryApi } from '../api/services';
import toast from 'react-hot-toast';

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    contactApi.getContact()
      .then(res => {
        const data = res.data?.data || res.data || res;
        if (data && typeof data === 'object') {
          setContact(data);
        }
      })
      .catch(err => console.error('Failed to load contact info:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.message) {
      toast.error('Please enter your name, phone number, and a message.');
      return;
    }

    setSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    enquiryApi.create({
      name: fullName,
      phone: formData.phone,
      subject: formData.subject || 'Workshop Service Request',
      message: formData.message,
    })
      .then(() => {
        toast.success('Your message has been received! Our technicians will contact you shortly.');
        setFormData({ firstName: '', lastName: '', phone: '', subject: '', message: '' });
      })
      .catch(err => {
        console.error('Enquiry submission error:', err);
        const msg = err.response?.data?.message || err.message || 'Failed to send message. Please contact us directly via phone.';
        toast.error(Array.isArray(msg) ? msg[0] : msg);
      })
      .finally(() => setSubmitting(false));
  };

  const getEmbedMapUrl = (rawUrl) => {
    if (!rawUrl) return null;
    const iframeMatch = rawUrl.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) return iframeMatch[1];
    return rawUrl;
  };

  const primaryPhone = contact?.primaryPhone || '+91 89693 64937';
  const cleanPhone = primaryPhone.replace(/[^0-9+]/g, '');
  const whatsappNum = (contact?.whatsapp || '918969364937').replace(/[^0-9]/g, '');
  const email = contact?.email || 'service@ganpatidiesel.com';
  const address = contact?.address || '1234 Industrial Node, MI 48201';
  const openingHours = contact?.openingHours || 'Node: Mon-Fri 7AM-6PM | Mobile: 24/7';
  const secondaryPhone = contact?.secondaryPhone;

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Connect</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Establish <span className="text-gray-500">Connection</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-3 text-sm font-light">
            Need diagnostic assistance, on-site heavy machinery support, or scheduled maintenance? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 glass-card p-8 rounded-3xl border border-white/10"
          >
            <h4 className="text-xl font-medium text-white mb-2">Initialize Request</h4>
            <p className="text-xs text-gray-400 mb-8 font-light">Submit your query directly to our central diagnostic dispatch.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" 
                    placeholder="First Name *" 
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" 
                    placeholder="Last Name" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" 
                    placeholder="Phone Number *" 
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" 
                    placeholder="Asset / Engine Model (e.g. Cummins, Caterpillar)" 
                  />
                </div>
              </div>

              <div>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 resize-none" 
                  placeholder="Describe the issue or required service..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="group bg-white hover:bg-gray-200 text-black w-full font-medium py-4 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Transmitting Request...' : (
                  <>
                    Transmit Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Headquarters / Workshop */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Headquarters</p>
                <p className="text-gray-400 text-sm font-light break-words">{address}</p>
              </div>
            </div>

            {/* Direct Line / Phones */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Direct Line</p>
                <p className="text-gray-400 text-sm font-light break-words">
                  Main: {primaryPhone}
                  {secondaryPhone && ` | 24/7: ${secondaryPhone}`}
                </p>
              </div>
            </div>

            {/* Network Email */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Network Email</p>
                <a href={`mailto:${email}`} className="text-gray-400 text-sm font-light hover:text-white transition-colors break-words">
                  {email}
                </a>
              </div>
            </div>

            {/* Uptime Schedule */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Uptime Schedule</p>
                <p className="text-gray-400 text-sm font-light break-words">{openingHours}</p>
              </div>
            </div>

            {/* Instant Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a 
                href={`tel:${cleanPhone}`} 
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5 text-primary" /> Initiate Call
              </a>
              <a 
                href={`https://wa.me/${whatsappNum}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" /> Chat with Us
              </a>
            </div>
          </motion.div>

        </div>

        {/* Embedded Google Maps (if provided in CMS) */}
        {contact?.googleMapsUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card h-80 sm:h-96 w-full relative"
          >
            <iframe
              src={getEmbedMapUrl(contact.googleMapsUrl)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Workshop Location"
              className="w-full h-full filter contrast-105"
            />
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Contact;

