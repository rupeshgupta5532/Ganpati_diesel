const fs = require('fs');
const file = 'src/pages/Public/Home.jsx';
let code = fs.readFileSync(file, 'utf8');

const newHero = `
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-black">
        
        {/* Full Screen Sliding Backgrounds */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={\`absolute inset-0 transition-opacity duration-1000 ease-in-out \${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}\`}
          >
            <img 
              src={slide} 
              alt="Diesel Background" 
              className={\`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear \${index === currentSlide ? 'scale-110' : 'scale-100'}\`} 
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
                className={\`h-2 rounded-full transition-all duration-300 \${index === currentSlide ? 'w-10 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white'}\`}
                aria-label={\`Go to slide \${index + 1}\`}
              />
            ))}
          </div>
        </div>
      </section>`;

code = code.replace(
  /\{\/\* Hero Section \*\/\}[\s\S]*?<\/section>/,
  newHero
);

fs.writeFileSync(file, code);
