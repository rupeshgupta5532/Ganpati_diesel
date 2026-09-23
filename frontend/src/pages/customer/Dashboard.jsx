import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">Welcome, {user?.name}</h1>
        <p className="text-gray-500 mt-2">Here is an overview of your recent bookings and activities.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 flex flex-col justify-between hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none border-t-4 border-t-blue-500">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Bookings</span>
           <span className="text-4xl font-extrabold text-brand-primary">5</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 flex flex-col justify-between hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none border-t-4 border-t-orange-500">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pending</span>
           <span className="text-4xl font-extrabold text-brand-primary">1</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 flex flex-col justify-between hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none border-t-4 border-t-green-500">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Completed</span>
           <span className="text-4xl font-extrabold text-brand-primary">3</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 flex flex-col justify-between hover:shadow dark:shadow-none-md dark:shadow dark:shadow-none-none transition-shadow dark:shadow-none border-t-4 border-t-red-500">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cancelled</span>
           <span className="text-4xl font-extrabold text-brand-primary">0</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-brand-primary">Recent Bookings</h2>
         </div>
         <div className="p-8 text-center text-gray-400 text-sm">
            Please navigate to the <span className="font-bold text-brand-primary">My Bookings</span> tab to view full details.
         </div>
      </div>
    </div>
  );
};
