
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingCart,
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`bg-sidebar text-sidebar-foreground fixed lg:relative z-50 transition-all duration-300 ease-in-out h-full ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold">ProDash</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          
          <div className="flex flex-col flex-grow p-4 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                }`
              }
            >
              <Home size={20} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </NavLink>
            
            <NavLink
              to="/dashboard/products"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                }`
              }
            >
              <Package size={20} />
              {isSidebarOpen && <span className="ml-3">Products</span>}
            </NavLink>
            
            <NavLink
              to="/dashboard/orders"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                }`
              }
            >
              <ShoppingCart size={20} />
              {isSidebarOpen && <span className="ml-3">Orders</span>}
            </NavLink>
          </div>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center mb-4">
              <div className="bg-sidebar-accent rounded-full w-8 h-8 flex items-center justify-center">
                <span className="uppercase font-medium text-sm">
                  {user?.name?.charAt(0) || '?'}
                </span>
              </div>
              {isSidebarOpen && (
                <div className="ml-2">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs opacity-70">{user?.email}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center lg:justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              {isSidebarOpen && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
