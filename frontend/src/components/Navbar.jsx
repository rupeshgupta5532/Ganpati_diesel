import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Link } from 'react-router';
import BookButton from './BookButton';
import ThemeSwitch from './ThemeSwitch';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Products', path: '/products' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/#contact' },
  ];

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
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all text-sm font-medium tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Call to Action Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitch />
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
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
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
