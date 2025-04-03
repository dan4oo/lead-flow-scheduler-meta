
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  UserCircle
} from 'lucide-react';
import { clients } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const CRMSidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  
  // In a real app, this would come from your auth context
  const userRole = window.localStorage.getItem('userRole') || 'admin';
  
  // For client role, don't render the sidebar at all
  if (userRole === 'client') {
    return null;
  }
  
  const adminNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: MessageSquare, label: 'Communications', path: '/communications' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
  ];
  
  const secondaryNav = [
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleRoleToggle = () => {
    // In a real app, this would be handled by a proper auth system
    // This is just for demonstration purposes
    const newRole = userRole === 'admin' ? 'client' : 'admin';
    window.localStorage.setItem('userRole', newRole);
    window.location.href = newRole === 'admin' ? '/' : '/client-dashboard';
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "flex flex-col border-r"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
              <span className="text-sidebar text-xl font-bold">CRM</span>
            </div>
            <h1 className="text-sidebar-foreground text-xl font-semibold">LeadFlow</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1",
                  isActive(item.path)
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          {secondaryNav.length > 0 && (
            <div className="px-2 space-y-1 pt-6 mt-6 border-t border-sidebar-border">
              {secondaryNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1",
                    isActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCircle className="h-8 w-8 text-sidebar-foreground" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                Admin User
              </p>
              <p className="text-xs text-sidebar-foreground/80">
                admin@example.com
              </p>
            </div>
            <div className="ml-auto flex">
              {/* Demo toggle button - in a real app this would be handled by auth system */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRoleToggle}
                      className="text-xs text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                    >
                      Switch to Client
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Demo feature to switch between roles</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                onClick={() => toast({ title: "Logout", description: "This is a demo application. No actual logout occurs." })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CRMSidebar;
