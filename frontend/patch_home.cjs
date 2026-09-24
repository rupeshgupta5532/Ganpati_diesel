const fs = require('fs');

const file = 'src/pages/Public/Home.jsx';
let code = fs.readFileSync(file, 'utf8');

const sliderLogic = `import React, { useState, useEffect } from 'react';
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
`;

code = code.replace(
  /import React from 'react';\nimport \{ Link \} from 'react-router';\n\nexport const Home = \(\) => \{/,
  sliderLogic
);

// We need to inject the full-background slider into the Hero Section.
// The Hero Section is: <section className="relative bg-brand-primary overflow-hidden min-h-[85vh] flex items-center">
// We will change it to have the sliding background images with Ken Burns zoom!

const newHero = `
      {/* Hero Section */}
      <section className="relative bg-brand-primary overflow-hidden min-h-[85vh] flex items-center">
        
        {/* Full Screen Sliding Backgrounds with Ken Burns Effect */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={\`absolute inset-0 transition-opacity duration-1000 ease-in-out \${index === currentSlide ? 'opacity-40 z-0' : 'opacity-0 -z-10'}\`}
          >
            <img 
              src={slide} 
              alt="Diesel Background" 
              className={\`w-full h-full object-cover grayscale transition-transform duration-[10000ms] ease-linear \${index === currentSlide ? 'scale-110' : 'scale-100'}\`} 
            />
          </div>
        ))}

        {/* Brand Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/90 to-brand-primary/40 z-0"></div>
        <div className="absolute inset-0 bg-brand-primary/30 z-0 mix-blend-multiply"></div>
        
        {/* Abstract Technical Background Details */}
        <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-accent to-transparent opacity-30 transform skew-x-12 translate-x-32"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 text-left pt-12 md:pt-0">
             <div className="inline-block px-3 py-1 bg-brand-border/80 backdrop-blur-sm text-brand-accent text-xs font-bold tracking-widest rounded mb-6 uppercase border border-brand-accent/50 shadow-lg">
               Estd. 2004 A.D. | Birgunj, Nepal
             </div>
             <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-xl">
               NEW SHREE GANPATI <br />
               <span className="text-brand-accent drop-shadow-lg">DIESEL SERVICE</span>
             </h1>
             <p className="text-xl md:text-2xl text-slate-200 mb-6 font-light drop-shadow">
               21+ Years of Diesel Engineering Excellence
             </p>
             <p className="text-sm md:text-base text-gray-300 mb-10 max-w-lg leading-relaxed font-medium">
               Advanced Fuel Pump • Injector • CRDI • Diagnostics. We combine traditional mechanical expertise with modern automotive technology.
             </p>
             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
               <Link to="/book-service" className="bg-brand-accent text-brand-primary text-center px-8 py-4 rounded font-bold shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-hover transition-colors">
                 🔧 Book a Service
               </Link>
               <Link to="/contact" className="border-2 border-brand-accent/50 backdrop-blur-sm text-white text-center px-8 py-4 rounded font-bold hover:border-brand-accent hover:bg-brand-accent/10 transition-colors shadow-lg">
                 📞 Call Now
               </Link>
             </div>
          </div>
          
          <div className="md:w-2/5 mt-16 md:mt-0 relative hidden md:block">
             {/* Circular rotating HUD elements matching the abstract tech theme */}
             <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full border-2 border-brand-accent/20 border-dashed animate-[spin_40s_linear_infinite] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
             <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full border-b-4 border-brand-accent/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite_reverse]"></div>
             
             {/* Mini slider image for the right side focusing on parts */}
             <div className="relative z-10 w-full h-80 lg:h-96 rounded-2xl shadow-2xl overflow-hidden border border-brand-accent/20">
               {slides.map((slide, index) => (
                  <img 
                    key={'mini'+index}
                    src={slide} 
                    alt="Diesel Engineering" 
                    className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 \${index === currentSlide ? 'opacity-100' : 'opacity-0'}\`}
                  />
               ))}
               <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent"></div>
               <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
                 {slides.map((_, index) => (
                   <button 
                     key={'dot'+index}
                     onClick={() => setCurrentSlide(index)}
                     className={\`w-2 h-2 rounded-full transition-all \${index === currentSlide ? 'w-6 bg-brand-accent' : 'bg-white/50 hover:bg-white'}\`}
                   />
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>`;

code = code.replace(
  /\{\/\* Hero Section \*\/\}[\s\S]*?<\/section>/,
  newHero
);

fs.writeFileSync(file, code);
