
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  ShoppingCart, 
  User, 
  X, 
  Search,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Marketplace', path: '/marketplace' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: FileText, label: 'Resources', path: '/resources' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MapPin, label: 'Lost & Found', path: '/lost-found' },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar fixed left-0 top-0 z-40 flex flex-col transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {expanded && (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">UniConnect</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-sidebar-accent"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {currentUser && (
        <div className={cn(
          "flex items-center p-4 border-b border-sidebar-border",
          expanded ? "justify-start" : "justify-center"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.profilePic} />
            <AvatarFallback className="bg-primary text-white">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          
          {expanded && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-300 truncate">{currentUser.matric || currentUser.email}</p>
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                  location.pathname === item.path && "bg-sidebar-accent text-white",
                  !expanded && "justify-center px-2"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-5 w-5", !expanded && "mx-auto")} />
                {expanded && <span className="ml-3">{item.label}</span>}
              </Button>
            </li>
          ))}
          
          <li>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-white relative",
                location.pathname === '/notifications' && "bg-sidebar-accent text-white",
                !expanded && "justify-center px-2"
              )}
              onClick={() => navigate('/notifications')}
            >
              <Bell className={cn("h-5 w-5", !expanded && "mx-auto")} />
              {expanded && <span className="ml-3">Notifications</span>}
              {unreadCount > 0 && (
                <Badge 
                  className="absolute bg-red-500 text-white text-xs" 
                  style={{ 
                    top: expanded ? '8px' : '5px', 
                    right: expanded ? '12px' : '5px',
                    padding: '0.15rem 0.4rem',
                    minWidth: '1rem'
                  }}
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </li>
        </ul>
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
              !expanded && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-5 w-5", !expanded && "mx-auto")} />
            {expanded && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
