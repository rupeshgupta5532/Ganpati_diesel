import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationApi } from '../api/notificationApi';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    if (!user) return;
    notificationApi.getAll().then(res => {
      const data = res.data.data || res.data;
      setNotifications(data);
    }).catch(console.error);

    notificationApi.getUnreadCount().then(res => {
      setUnreadCount(res.data.data || res.data || 0);
    }).catch(console.error);
  };

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    
    const newSocket = io(`${baseUrl}/notifications`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectionAttempts: 3,
      reconnectionDelay: 5000,
    });

    newSocket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
