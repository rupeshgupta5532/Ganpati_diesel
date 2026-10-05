import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-32 relative z-10">
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
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Establish <span className="text-gray-500">Connection</span></h2>
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
            <h4 className="text-xl font-medium text-white mb-8">Initialize Request</h4>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" placeholder="First Name" />
                </div>
                <div>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" placeholder="Last Name" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" placeholder="Phone Number" />
                </div>
                <div>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" placeholder="Asset ID (Make/Model)" />
                </div>
              </div>

              <div>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 resize-none" placeholder="Describe the anomaly..."></textarea>
              </div>

              <button type="button" className="group bg-white hover:bg-gray-200 text-black w-full font-medium py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                Transmit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Headquarters</p>
                <p className="text-gray-500 text-sm font-light">1234 Industrial Node, MI 48201</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Direct Line</p>
                <p className="text-gray-500 text-sm font-light">Main: (555) 123-4567 | 24/7: (555) 987-6543</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Network Email</p>
                <p className="text-gray-500 text-sm font-light">service@ganpatidiesel.com</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Uptime Schedule</p>
                <p className="text-gray-500 text-sm font-light">Node: Mon-Fri 7AM-6PM | Mobile: 24/7</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
