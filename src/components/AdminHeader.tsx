import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  User, 
  LogOut,
  ChevronDown,
  Home,
  Bell
} from 'lucide-react';
import { authService } from '../services/api';

const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/';
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-neon-purple/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg group-hover:animate-glow transition-all duration-300">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-gaming text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                GameZone Admin
              </h1>
              <p className="text-xs text-gray-400 font-tech">Management Panel</p>
            </div>
          </Link>

          {/* Admin Actions */}
          <div className="flex items-center space-x-4">
            {/* Back to Site */}
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-dark-card hover:bg-dark-hover rounded-lg border border-neon-blue/30 hover:border-neon-blue transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-dark-hover transition-colors relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            {user && (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-hover transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-dark-card border border-neon-purple/20 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <p className="text-neon-purple text-xs mt-1">Administrator</p>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {handleLogout(); setIsProfileOpen(false);}}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-red-600/20 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;