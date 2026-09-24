import React from 'react';
import { Link } from 'react-router';

export const Home = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-brand-primary overflow-hidden min-h-[85vh] flex items-center">
        {/* Abstract Technical Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-accent to-transparent opacity-20 transform skew-x-12 translate-x-32"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 text-left pt-12 md:pt-0">
             <div className="inline-block px-3 py-1 bg-brand-border text-brand-accent text-xs font-bold tracking-widest rounded mb-6 uppercase border border-brand-accent/30">
               Estd. 2004 A.D. | Birgunj, Nepal
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
               NEW SHREE GANPATI <br />
               <span className="text-brand-accent">DIESEL SERVICE</span>
             </h1>
             <p className="text-xl md:text-2xl text-brand-text-secondary mb-6 font-light">
               21+ Years of Diesel Engineering Excellence
             </p>
             <p className="text-sm md:text-base text-gray-400 mb-10 max-w-lg leading-relaxed">
               Advanced Fuel Pump • Injector • CRDI • Diagnostics. We combine traditional mechanical expertise with modern automotive technology.
             </p>
             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
               <Link to="/book-service" className="bg-brand-accent text-brand-primary text-center px-8 py-4 rounded font-bold shadow dark:shadow-none-lg shadow dark:shadow-none-brand-accent/20 hover:bg-brand-accent-hover transition-colors">
                 🔧 Book a Service
               </Link>
               <Link to="/contact" className="border-2 border-brand-border text-white text-center px-8 py-4 rounded font-bold hover:border-white transition-colors">
                 📞 Call Now
               </Link>
             </div>
          </div>
          
          <div className="md:w-2/5 mt-16 md:mt-0 relative">
             <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-brand-border border-dashed animate-[spin_60s_linear_infinite] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
             <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-brand-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800" 
               alt="Diesel Engineering" 
               className="relative z-10 w-full rounded-lg shadow dark:shadow-none-2xl object-cover h-80 md:h-96 grayscale hover:grayscale-0 transition-all duration-700 border border-brand-border"
             />
          </div>
        </div>
      </section>

      {/* Trust / Stats Bar */}
      <section className="bg-brand-secondary border-b border-brand-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-brand-border/50">
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">21+</div>
              <div className="text-xs text-brand-text-secondary uppercase tracking-widest">Years Experience</div>
            </div>
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold text-brand-accent mb-1">5000+</div>
              <div className="text-xs text-brand-text-secondary uppercase tracking-widest">Projects Completed</div>
            </div>
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">2004</div>
              <div className="text-xs text-brand-text-secondary uppercase tracking-widest">Established</div>
            </div>
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-xs text-brand-text-secondary uppercase tracking-widest">Nationwide Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
           <div className="md:w-1/2 relative">
             <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-accent rounded-lg opacity-20"></div>
             <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800" alt="Workshop" className="rounded-lg shadow dark:shadow-none-xl relative z-10 w-full object-cover h-96" />
           </div>
           <div className="md:w-1/2">
             <h2 className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-2">About Us</h2>
             <h3 className="text-4xl font-extrabold text-brand-primary dark:text-slate-100 mb-6 leading-tight">21 Years of Diesel Engineering Excellence</h3>
             <p className="text-gray-600 mb-6 leading-relaxed">
               Since 2004, New Shree Ganpati Diesel Service has been at the forefront of automotive diesel engineering in Birgunj. We combine decades of traditional mechanical expertise with the latest in digital diagnostic technology.
             </p>
             <ul className="space-y-3 mb-8">
               <li className="flex items-center text-brand-primary font-semibold"><span className="text-brand-accent mr-3">✓</span> Advanced Diagnostics</li>
               <li className="flex items-center text-brand-primary font-semibold"><span className="text-brand-accent mr-3">✓</span> Genuine OEM Parts</li>
               <li className="flex items-center text-brand-primary font-semibold"><span className="text-brand-accent mr-3">✓</span> Precision Calibration</li>
             </ul>
             <Link to="/about" className="inline-block border-2 border-brand-primary text-brand-primary px-8 py-3 rounded font-bold hover:bg-brand-primary hover:text-white transition-colors dark:text-brand-accent">
               Learn More About Us
             </Link>
           </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-brand-primary py-24 border-y border-brand-border text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-black/50 z-0"></div>
         <div className="container mx-auto px-4 relative z-10">
           <h2 className="text-4xl font-extrabold text-white mb-4">Need Diesel System Service?</h2>
           <p className="text-xl text-brand-text-secondary mb-10 max-w-2xl mx-auto">
             Book your vehicle with Nepal's leading diesel diagnostics and repair experts today.
           </p>
           <Link to="/book-service" className="bg-brand-accent text-brand-primary px-10 py-4 rounded font-bold text-lg shadow dark:shadow-none-xl hover:bg-brand-accent-hover transition-colors inline-block">
             Book Your Service Today
           </Link>
         </div>
      </section>
    </div>
  );
};
