import React, { useState } from 'react';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

import { Link, useLocation } from 'react-router';
import BookButton from './BookButton';
import ThemeSwitch from './ThemeSwitch';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed w-full z-50 top-0 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/50">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Ganpati Diesel Logo" className="h-9 w-9 rounded-full object-cover border border-white/20" />
          <span className="font-semibold text-xl tracking-tight text-white hidden lg:block">
            Ganpati<span className="text-gray-400 font-light">Diesel</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-1 items-center bg-white/5 rounded-full px-2 py-1 border border-white/5">
          {navLinks.map((link) => {
            const isActive = (link.path.includes('#') && location.pathname + location.hash === link.path) || (!link.path.includes('#') && location.pathname === link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full transition-all text-sm font-medium tracking-wide ${
                  isActive 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Call to Action Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitch />
          {isAuthenticated ? (
            <Link to="/profile" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all" title="My Profile">
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">
              Login
            </Link>
          )}
          <BookButton to="/book-service" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white p-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="md:hidden glass mt-4 rounded-2xl p-4 max-w-6xl mx-auto"
        >
          <div className="space-y-2">
            {navLinks.map((link) => {
              const isActive = (link.path.includes('#') && location.pathname + location.hash === link.path) || (!link.path.includes('#') && location.pathname === link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center bg-primary text-black px-4 py-3 rounded-xl font-semibold text-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-black px-4 py-3 rounded-xl font-semibold text-sm"
                >
                  <User className="h-4 w-4" /> My Profile
                </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
