
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

  // Add a new notification with guaranteed unique ID
  const addNotification = (notification) => {
    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
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

  // Helper function to create notifications for different activities
  const createActivityNotification = (activityType, userData, itemData) => {
    let title, message, type;
    
    switch(activityType) {
      case 'resource_upload':
        title = 'New Resource Shared';
        message = `${userData?.name || 'Someone'} uploaded "${itemData.title || 'a resource'}"`;
        type = 'resource';
        break;
      case 'event_post':
        title = 'New Event Posted';
        message = `${userData?.name || 'Someone'} posted an event: "${itemData.title || 'New event'}"`;
        type = 'event';
        break;
      case 'message_sent':
        title = 'New Message';
        message = `${userData?.name || 'Someone'} sent you a message`;
        type = 'message';
        break;
      case 'marketplace_listing':
        title = 'New Marketplace Listing';
        message = `${userData?.name || 'Someone'} listed "${itemData.title || 'an item'}" for sale`;
        type = 'marketplace';
        break;
      default:
        title = 'New Notification';
        message = 'You have a new notification';
        type = 'general';
    }
    
    return addNotification({
      title,
      message,
      type,
      activityType,
      userData,
      itemData
    });
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
    createActivityNotification,
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
