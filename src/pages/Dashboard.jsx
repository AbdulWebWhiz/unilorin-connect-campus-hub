
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShoppingCart, Calendar, MessageSquare, FileText, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [latestItems, setLatestItems] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  // Mock data for recent marketplace items
  useEffect(() => {
    // This would be an API call in a real application
    const mockItems = [
      { id: '1', title: 'Calculus Textbook', price: '₦3,500', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
      { id: '2', title: 'Study Desk', price: '₦15,000', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { id: '3', title: 'Scientific Calculator', price: '₦5,000', image: 'https://images.unsplash.com/photo-1564473185935-b0ae17d3e571?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
    ];
    
    setLatestItems(mockItems);
    
    // Mock events
    const today = new Date();
    const mockEvents = [
      { 
        id: '1', 
        title: 'Faculty of Engineering Seminar', 
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
        location: 'Engineering Auditorium' 
      },
      { 
        id: '2', 
        title: 'Campus Clean-up Drive', 
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
        location: 'Student Union Building' 
      },
    ];
    
    setUpcomingEvents(mockEvents);
    
    // Demo notification
    setTimeout(() => {
      addNotification({
        title: 'Welcome to UniConnect!',
        message: 'Explore the platform and connect with other students.',
        type: 'info'
      });
    }, 3000);
  }, [addNotification]);
  
  const featuredItems = [
    {
      title: 'Marketplace',
      description: 'Buy and sell items with other students',
      icon: <ShoppingCart className="h-10 w-10 text-uniblue-500" />,
      path: '/marketplace'
    },
    {
      title: 'Events',
      description: 'Discover campus events and activities',
      icon: <Calendar className="h-10 w-10 text-uniblue-500" />,
      path: '/events'
    },
    {
      title: 'Chat',
      description: 'Connect with friends and classmates',
      icon: <MessageSquare className="h-10 w-10 text-uniblue-500" />,
      path: '/chat'
    },
    {
      title: 'Resources',
      description: 'Access study materials and lecture notes',
      icon: <FileText className="h-10 w-10 text-uniblue-500" />,
      path: '/resources'
    },
    {
      title: 'Lost & Found',
      description: 'Report or find lost items on campus',
      icon: <MapPin className="h-10 w-10 text-uniblue-500" />,
      path: '/lost-found'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name.split(' ')[0] || 'Student'}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening on campus today.</p>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {featuredItems.map((item, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.description}</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-uniblue-500 hover:text-uniblue-600 p-0"
                onClick={() => navigate(item.path)}
              >
                Explore <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Marketplace Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Marketplace Items</CardTitle>
            <CardDescription>Recently listed items you might be interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/marketplace/${item.id}`)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-uniblue-500 font-semibold">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/marketplace')}
            >
              View All Items
            </Button>
          </CardFooter>
        </Card>
        
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events happening around campus soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-4 border rounded-lg hover:border-uniblue-300 cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{event.title}</h4>
                    <span className="text-sm bg-uniblue-100 text-uniblue-800 px-2 py-1 rounded">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{event.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/events')}
            >
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
