import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Gamepad2, 
  Trophy, 
  CreditCard,
  Settings,
  Monitor
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/consoles', label: 'Consoles', icon: Monitor },
    { path: '/admin/games', label: 'Games', icon: Gamepad2 },
    { path: '/admin/events', label: 'Events', icon: Trophy },
    { path: '/admin/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <AdminHeader />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-dark-card border-r border-neon-purple/20 fixed left-0 top-20 bottom-0 overflow-y-auto">
          <div className="p-6">
            <h2 className="font-gaming text-xl font-bold text-neon-purple mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                        : 'hover:bg-dark-hover text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 pt-20 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;