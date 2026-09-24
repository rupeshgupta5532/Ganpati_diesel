import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const CustomerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'My Bookings', path: '/bookings', icon: '📅' },
    { name: 'My Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-primary text-brand-text-secondary flex flex-col shadow dark:shadow-none-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-brand-border">
          <Link to="/" className="flex items-center space-x-3 mb-4 group">
             <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center font-bold text-brand-primary">G</div>
             <div>
               <h2 className="text-white font-bold text-sm leading-tight group-hover:text-brand-accent transition-colors">NEW SHREE GANPATI</h2>
             </div>
          </Link>
          <p className="text-xs text-brand-text-secondary mt-2">Welcome,</p>
          <p className="text-white font-bold truncate">{user?.name}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold transition-colors
                  ${isActive ? 'bg-brand-accent text-brand-primary' : 'hover:bg-brand-surface hover:text-white'}`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold text-red-400 hover:bg-brand-surface hover:text-red-300 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-slate-800 shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border-b px-4 md:px-8 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-brand-primary dark:text-slate-100 text-2xl focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
          </div><h1 className="text-xl font-bold text-brand-primary dark:text-slate-100 hidden sm:block">
             {navItems.find(item => location.pathname.includes(item.path))?.name || 'Customer Portal'}
          </h1>
          <div className="flex items-center space-x-6">
             <ThemeToggle />
             <Link to="/notifications" className="relative">
               {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{unreadCount > 9 ? "9+" : unreadCount}</span>}
               <span className="text-xl cursor-pointer">🔔</span>
             </Link>
             <Link to="/book-service" className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded hover:bg-brand-surface transition-colors">
               + Book Service
             </Link>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
