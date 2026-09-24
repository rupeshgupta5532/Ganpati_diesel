import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1920", // Mechanic hands
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1920", // Engine
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1920", // Truck
    "https://images.unsplash.com/photo-1503376760356-5eb69d414a38?q=80&w=1920"  // Tools
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="font-sans">
      
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-black">
        
        {/* Full Screen Sliding Backgrounds */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            <img 
              src={slide} 
              alt="Diesel Background" 
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} 
            />
            {/* Dark gradient overlay for text readability, but letting image shine through */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/95 via-brand-primary/70 to-transparent"></div>
          </div>
        ))}

        {/* Abstract Technical Background Details */}
        <div className="absolute inset-0 opacity-20 z-0 pointer-events-none mix-blend-overlay">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 text-left pt-12 md:pt-0">
             <div className="inline-block px-4 py-1.5 bg-brand-accent/10 backdrop-blur-md text-brand-accent text-sm font-bold tracking-widest rounded mb-6 uppercase border border-brand-accent/50 shadow-lg">
               Estd. 2004 A.D. | Birgunj, Nepal
             </div>
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
               NEW SHREE GANPATI <br />
               <span className="text-brand-accent">DIESEL SERVICE</span>
             </h1>
             <p className="text-2xl md:text-3xl text-slate-100 mb-6 font-light drop-shadow-lg max-w-2xl">
               21+ Years of Diesel Engineering Excellence
             </p>
             <p className="text-base md:text-lg text-slate-300 mb-10 max-w-xl leading-relaxed font-medium drop-shadow-md">
               Advanced Fuel Pump • Injector • CRDI • Diagnostics. We combine traditional mechanical expertise with modern automotive technology.
             </p>
             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
               <Link to="/book-service" className="bg-brand-accent text-brand-primary text-center px-10 py-4 rounded font-bold text-lg shadow-xl shadow-brand-accent/30 hover:bg-brand-accent-hover transition-all hover:scale-105">
                 🔧 Book a Service
               </Link>
               <Link to="/contact" className="border-2 border-white/50 backdrop-blur-sm text-white text-center px-10 py-4 rounded font-bold text-lg hover:border-white hover:bg-white/10 transition-all shadow-lg hover:scale-105">
                 📞 Call Now
               </Link>
             </div>
          </div>
          
          {/* Custom Navigation Dots positioned on the right or bottom */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button 
                key={'dot'+index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-10 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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
