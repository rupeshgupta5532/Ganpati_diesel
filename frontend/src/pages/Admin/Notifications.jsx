import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';

export const AdminNotifications = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useSocket();
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);

  const displayNotifications = showUnreadOnly ? notifications.filter(n => !n.isRead) : notifications;

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded shadow dark:shadow-none font-sans max-w-5xl mx-auto border border-brand-border/20 dark:border-brand-border/80">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary dark:text-slate-100">Notifications Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">You have {unreadCount} unread alerts.</p>
        </div>
        <div className="flex space-x-3 items-center">
          <label className="flex items-center space-x-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded border cursor-pointer">
            <input 
              type="checkbox" 
              checked={showUnreadOnly} 
              onChange={() => setShowUnreadOnly(!showUnreadOnly)}
              className="rounded text-brand-primary focus:ring-brand-accent"
            />
            <span>Unread Only</span>
          </label>
          <button 
            onClick={markAllAsRead} 
            disabled={unreadCount === 0}
            className="text-sm font-bold text-brand-primary hover:text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Mark All as Read
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {displayNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700">
            {showUnreadOnly ? 'No unread notifications! You are all caught up.' : 'No notifications history found.'}
          </div>
        ) : (
          displayNotifications.map((notification) => (
            <div 
              key={notification._id || Math.random()} 
              className={`p-4 rounded border-l-4 transition-colors flex justify-between items-start 
                ${!notification.isRead ? 'border-brand-accent bg-brand-surface/30' : 'border-slate-300 bg-slate-50 dark:bg-slate-900 opacity-75'}`}
            >
              <div>
                <p className={`font-bold ${!notification.isRead ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-300'}`}>
                  {notification.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{notification.message}</p>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <button 
                  onClick={() => markAsRead(notification._id)}
                  className="text-xs font-bold text-brand-primary hover:text-blue-600 bg-white dark:bg-slate-800 px-3 py-1 rounded shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-200 dark:border-slate-600"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
