
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CRMSidebar from './CRMSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const location = useLocation();
  
  // Get user role from localStorage
  const userRole = window.localStorage.getItem('userRole') || 'admin';
  const isClientDashboard = userRole === 'client' || location.pathname.includes('client-dashboard');
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile && !isClientDashboard);
  }, [isMobile, isClientDashboard]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <CRMSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen && !isClientDashboard ? "lg:ml-64" : "lg:ml-0",
        isClientDashboard ? "w-full" : ""
      )}>
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
