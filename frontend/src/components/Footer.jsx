import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
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
            <p className="text-gray-500 max-w-sm text-sm font-light leading-relaxed">
              Next-generation heavy-duty fleet infrastructure. We maintain logistics networks with decentralized, expert service protocols.
            </p>
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
            <p className="text-gray-500 mb-6 text-sm font-light leading-relaxed">
              Network failure? Our mobile nodes deploy 24/7.
            </p>
            <a href="tel:+918969364937" className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors border border-white/10">
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
