
import { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Bell, BellOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Notifications = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });
  
  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});
  
  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedNotifications).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>;
      case 'event':
        return <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>;
      case 'marketplace':
        return <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>;
      default:
        return <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with important events and messages</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button
            variant="outline"
            className="text-uniblue-500 border-uniblue-200"
            onClick={markAllAsRead}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex mb-6 border-b overflow-x-auto">
        <Button
          variant="ghost"
          className={cn(
            "px-4 py-2 rounded-none",
            activeFilter === 'all' && "border-b-2 border-uniblue-500 text-uniblue-500"
          )}
          onClick={() => setActiveFilter('all')}
        >
          All
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "px-4 py-2 rounded-none",
            activeFilter === 'unread' && "border-b-2 border-uniblue-500 text-uniblue-500"
          )}
          onClick={() => setActiveFilter('unread')}
        >
          Unread
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "px-4 py-2 rounded-none",
            activeFilter === 'read' && "border-b-2 border-uniblue-500 text-uniblue-500"
          )}
          onClick={() => setActiveFilter('read')}
        >
          Read
        </Button>
      </div>
      
      {/* Notifications */}
      {filteredNotifications.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  {new Date().toDateString() === date 
                    ? 'Today' 
                    : new Date(Date.now() - 86400000).toDateString() === date 
                      ? 'Yesterday' 
                      : format(new Date(date), 'MMMM d, yyyy')}
                </h3>
                
                <div className="space-y-3">
                  {groupedNotifications[date].map(notification => (
                    <Card 
                      key={notification.id} 
                      className={cn(
                        "hover:shadow transition-shadow",
                        !notification.read && "border-l-4 border-l-uniblue-500 bg-blue-50"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="p-2 bg-blue-100 rounded-full mr-4">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                <p className="text-gray-600 mt-1">{notification.message}</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                  {format(new Date(notification.timestamp), 'h:mm a')}
                                </span>
                                
                                {!notification.read && (
                                  <Badge className="bg-uniblue-500">New</Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-2 space-x-2">
                              {!notification.read && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-uniblue-500 border-uniblue-200"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Mark as Read
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-gray-500 border-gray-200"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">No notifications available</p>
          <p className="text-gray-500 mt-2">
            {activeFilter === 'all' 
              ? "You're all caught up!" 
              : `No ${activeFilter} notifications at the moment.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
