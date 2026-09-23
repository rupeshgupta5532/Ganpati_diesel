import React, { useState } from 'react';
import { Outlet, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const PublicLayout = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Contact Bar */}
      <div className="bg-brand-primary text-brand-text-secondary text-xs py-2 hidden md:block border-b border-brand-border">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <span>📍 Brahma Chowk, Birgunj, Parsa, Nepal</span>
            <span>📞 +977-9800000000</span>
          </div>
          <div className="flex space-x-4">
            <Link to={getDashboardLink()} className="hover:text-brand-accent transition-colors">
              {user ? (user.role === 'USER' ? 'Customer Portal' : 'Admin Portal') : 'Customer Login'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-brand-secondary text-white shadow dark:shadow-none-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-brand-accent rounded flex items-center justify-center font-bold text-brand-primary text-xl shadow dark:shadow-none-lg group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-brand-accent transition-colors">
                NEW SHREE GANPATI
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-brand-text-secondary">Diesel Service</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6 items-center text-sm font-semibold">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className="hover:text-brand-accent transition-colors">{link.name}</Link>
            ))}
            
            {user ? (
              <Link to={getDashboardLink()} className="bg-slate-700 text-white px-4 py-2 rounded font-bold shadow dark:shadow-none hover:bg-slate-600 transition-colors">
                {user.role === 'USER' ? 'My Dashboard' : 'Admin Panel'}
              </Link>
            ) : null}
            
            <ThemeToggle />
            <Link to="/book-service" className="bg-brand-accent text-brand-primary px-6 py-2 rounded font-bold shadow dark:shadow-none hover:bg-brand-accent-hover transition-colors">
              Book a Service
            </Link>
          </nav>
          
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-white text-3xl focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-primary border-t border-brand-border px-4 py-4 space-y-4 shadow dark:shadow-none-xl">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="block text-white font-semibold hover:text-brand-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-brand-border" />
            {user ? (
              <Link to={getDashboardLink()} className="block bg-slate-700 text-white text-center px-4 py-2 rounded font-bold shadow dark:shadow-none hover:bg-slate-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {user.role === 'USER' ? 'My Dashboard' : 'Admin Panel'}
              </Link>
            ) : (
              <Link to="/login" className="block text-brand-text-secondary hover:text-white font-semibold" onClick={() => setMobileMenuOpen(false)}>
                Customer Login
              </Link>
            )}
            <Link to="/book-service" className="block text-center bg-brand-accent text-brand-primary px-4 py-2 rounded font-bold shadow dark:shadow-none hover:bg-brand-accent-hover transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Book a Service
            </Link>
          </div>
        )}
      </header>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
         <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer" className="w-12 h-12 bg-green-500 rounded-full shadow dark:shadow-none-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
           W
         </a>
         <a href="tel:+9779800000000" className="w-12 h-12 bg-blue-600 rounded-full shadow dark:shadow-none-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
           📞
         </a>
      </div>

      <main className="flex-1 bg-gray-50 dark:bg-slate-900">
        <Outlet />
      </main>

      <footer className="bg-brand-primary text-brand-text-secondary py-16 border-t-4 border-brand-accent">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center font-bold text-brand-primary text-lg">
                G
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">NEW SHREE GANPATI</h3>
                <p className="text-[9px] uppercase tracking-wider">Diesel Service</p>
              </div>
            </div>
            <p className="text-sm mb-4">21 Years of Diesel Engineering Excellence. Advanced Fuel Pump, Injector, and CRDI Diagnostics.</p>
            <p className="text-xs">Estd. 2004 A.D. | Birgunj, Nepal</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-brand-accent transition-colors">Our Services</Link></li>
              <li><Link to="/products" className="hover:text-brand-accent transition-colors">Genuine Parts</Link></li>
              <li><Link to="/projects" className="hover:text-brand-accent transition-colors">Case Studies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/book-service" className="hover:text-brand-accent transition-colors">Book a Service</Link></li>
              <li><Link to="/reviews" className="hover:text-brand-accent transition-colors">Customer Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-brand-accent transition-colors">Customer Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Brahma Chowk, Birgunj, Nepal</li>
              <li>📞 +977-9800000000</li>
              <li>💬 WhatsApp Available</li>
              <li>📧 info@ganpatidiesel.com</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-brand-border text-center text-xs">
          &copy; {new Date().getFullYear()} New Shree Ganpati Diesel Service. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
