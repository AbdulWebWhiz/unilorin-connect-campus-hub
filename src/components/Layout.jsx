
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

const Layout = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  // Protected route logic
  useEffect(() => {
    const publicRoutes = ['/', '/login', '/signup'];
    
    if (!currentUser && !publicRoutes.includes(location.pathname)) {
      navigate('/login');
    }
  }, [currentUser, location.pathname, navigate]);
  
  // Listen for sidebar expand/collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if the current route should show sidebar
  const shouldShowSidebar = () => {
    const routesWithoutSidebar = ['/', '/login', '/signup'];
    return !routesWithoutSidebar.includes(location.pathname);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {shouldShowSidebar() && <Sidebar expanded={isSidebarExpanded} setExpanded={setIsSidebarExpanded} />}
      
      <main 
        className={cn(
          "min-h-screen transition-all duration-300",
          shouldShowSidebar() && (isSidebarExpanded ? "ml-64" : "ml-20")
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
