import React from 'react';
import { Link } from 'react-router';

export const About = () => {
  return (
    <div className="font-sans bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-brand-primary overflow-hidden py-24 border-b border-brand-accent/20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1503376760356-5eb69d414a38?q=80&w=1920')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-accent/10 backdrop-blur-md text-brand-accent text-sm font-bold tracking-widest rounded mb-6 uppercase border border-brand-accent/50 shadow-lg">
            About Our Workshop
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
            Driving Diesel <span className="text-brand-accent">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Since 2004, New Shree Ganpati Diesel Service has been the premier destination for diesel engineering, fuel pump calibration, and advanced diagnostics in Birgunj, Nepal.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-accent rounded-2xl opacity-20 hidden md:block"></div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-dashed border-brand-primary dark:border-brand-accent/30 rounded-full animate-spin-slow opacity-20 hidden md:block"></div>
              <img 
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800" 
                alt="Diesel Mechanic at Work" 
                className="relative z-10 rounded-2xl shadow-2xl w-full object-cover h-[500px]" 
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-3">Our Legacy</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-brand-primary dark:text-slate-100 mb-6 leading-tight">
                21+ Years of Relentless Mechanical Precision
              </h3>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  What started over two decades ago as a modest workshop in Brahma Chowk has evolved into Nepal's leading diesel diagnostics facility. We specialize in bringing life back to heavily used commercial trucks, agricultural tractors, and industrial generators.
                </p>
                <p>
                  As engines evolved from traditional mechanical fuel injection to complex Common Rail Direct Injection (CRDI) systems, so did we. We have heavily invested in computerized diagnostic scanners and advanced calibration test benches to bridge the gap between traditional mechanical grit and modern software diagnostics.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-10">
                <div className="border-l-4 border-brand-accent pl-4">
                  <div className="text-4xl font-extrabold text-brand-primary dark:text-slate-100 mb-1">5000+</div>
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Happy Clients</div>
                </div>
                <div className="border-l-4 border-brand-accent pl-4">
                  <div className="text-4xl font-extrabold text-brand-primary dark:text-slate-100 mb-1">100%</div>
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quality Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-3">The Ganpati Advantage</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold mb-6">Why Choose Our Workshop?</h3>
            <p className="text-lg text-slate-300">We don't just replace parts; we diagnose, engineer, and calibrate your engine to factory perfection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💻', title: 'Advanced Diagnostics', desc: 'Equipped with the latest OBD2 scanners and CRDI test benches to pinpoint exact electronic and mechanical failures.' },
              { icon: '⚙️', title: 'Genuine OEM Parts', desc: 'We source strictly authenticated OEM components to ensure your fuel pump and injectors endure harsh working environments.' },
              { icon: '👨‍🔧', title: 'Master Technicians', desc: 'Our head engineers possess over two decades of hands-on experience exclusively dealing with heavy diesel machinery.' },
              { icon: '⏱️', title: 'Fast Turnaround', desc: 'We understand downtime costs you money. Our streamlined workflow guarantees rapid repair without compromising quality.' },
              { icon: '🔬', title: 'Precision Calibration', desc: 'Fuel delivery must be calculated down to the micro-millimeter. We use highly calibrated equipment to tune your injectors.' },
              { icon: '🤝', title: 'Honest Pricing', desc: 'No hidden fees. We provide a transparent breakdown of parts and labor before initiating any major mechanical surgery.' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 hover:border-brand-accent/50 transition-all group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-6">Ready to Experience Peak Performance?</h2>
          <p className="text-xl text-brand-primary/80 mb-10 max-w-2xl mx-auto font-medium">
            Bring your vehicle to our Birgunj workshop and let our master technicians restore your engine's true power.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/book-service" className="bg-brand-primary text-white text-center px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-slate-800 transition-all hover:-translate-y-1">
              Book Your Service
            </Link>
            <Link to="/contact" className="border-2 border-brand-primary text-brand-primary text-center px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-primary hover:text-white transition-all hover:-translate-y-1">
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
