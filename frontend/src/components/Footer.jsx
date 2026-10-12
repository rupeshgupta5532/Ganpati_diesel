import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { contactApi } from '../api/services';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    contactApi.getContact()
      .then(res => {
        const data = res.data?.data || res.data || res;
        if (data && typeof data === 'object') {
          setContact(data);
        }
      })
      .catch(err => console.error('Failed to load contact info in footer:', err));
  }, []);

  const phone = contact?.primaryPhone || '+91 89693 64937';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="border-t border-white/5 bg-dark relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Ganpati Diesel Logo" className="h-8 w-8 rounded-full object-cover border border-white/20" />
              <span className="font-semibold text-xl tracking-tight text-white">
                Ganpati<span className="text-gray-400 font-light">Diesel</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm text-sm font-light leading-relaxed mb-4">
              Next-generation heavy-duty fleet infrastructure. We maintain logistics networks with decentralized, expert service protocols.
            </p>
            {contact?.address && (
              <p className="text-gray-400 text-xs flex items-center gap-2 font-light">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                <span>{contact.address}</span>
              </p>
            )}
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-6">Protocol</h4>
            <ul className="space-y-3 text-gray-500 font-light text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Platform</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Network</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Connect</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-6">Emergency Node</h4>
            <p className="text-gray-500 mb-4 text-sm font-light leading-relaxed">
              Network failure? Our mobile nodes deploy 24/7.
            </p>
            <p className="text-white font-mono text-sm mb-4">
              {phone}
            </p>
            <a href={`tel:${cleanPhone}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors border border-white/10">
              <Phone size={14} className="text-primary" />
              Initialize Call
            </a>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs font-light tracking-wide">
            &copy; {new Date().getFullYear()} Ganpati Diesel Network. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-600 text-xs font-light tracking-wide">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
