import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Services', path: '/admin/services', icon: '🔧' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Projects', path: '/admin/projects', icon: '🛠️' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: '✉️' },
    { name: 'Reviews', path: '/admin/reviews', icon: '⭐' },
    { name: 'Website Content', path: '/admin/content', icon: '📝' },
    { name: 'Contact Details', path: '/admin/contact', icon: '📞' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-primary text-brand-text-secondary flex flex-col shadow dark:shadow-none-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-brand-border">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center font-bold text-brand-primary">G</div>
            <h2 className="text-white font-bold text-lg tracking-tight">ADMIN PORTAL</h2>
          </div>
          <p className="text-xs text-brand-text-secondary truncate">{user?.email}</p>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white dark:bg-slate-800 shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border-b px-4 md:px-8 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-brand-primary dark:text-slate-100 text-2xl focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
          </div><h1 className="text-xl font-bold text-brand-primary dark:text-slate-100 hidden sm:block">
             {navItems.find(item => location.pathname.includes(item.path))?.name || 'Admin Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
             <ThemeToggle />
             <Link to="/admin/notifications" className="relative block">
               {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{unreadCount > 9 ? "9+" : unreadCount}</span>}
               <span className="text-xl cursor-pointer">🔔</span>
             </Link>
             <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
               {user?.name?.charAt(0) || 'A'}
             </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
