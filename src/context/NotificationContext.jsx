
import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('unilorinNotifications') || '[]');
    setNotifications(storedNotifications);
    
    // Calculate unread count
    const unread = storedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, []);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prevNotifications => {
      const updated = [newNotification, ...prevNotifications];
      localStorage.setItem('unilorinNotifications', JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => {
      const updated = prevNotifications.map(notification => {
        if (notification.id === notificationId && !notification.read) {
          setUnreadCount(prev => prev - 1);
          return { ...notification, read: true };
        }
        return notification;
      });
      
      localStorage.setItem('unilorinNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => {
      const updated = prevNotifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      localStorage.setItem('unilorinNotifications', JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(0);
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(prevNotifications => {
      const notification = prevNotifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => prev - 1);
      }
      
      const updated = prevNotifications.filter(n => n.id !== notificationId);
      localStorage.setItem('unilorinNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
