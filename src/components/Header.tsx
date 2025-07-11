import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Menu, 
  X, 
  Calendar, 
  User, 
  Trophy, 
  BookOpen, 
  Phone,
  Home,
  LogIn,
  LogOut,
  ChevronDown,
  Settings,
  Monitor
} from 'lucide-react';
import { authService } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
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
      setUser(null);
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      window.location.href = '/';
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/booking', label: 'Booking', icon: Calendar },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/consoles', label: 'Consoles', icon: Monitor },
    { path: '/events', label: 'Events', icon: Trophy },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: Phone }
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-neon-blue/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg group-hover:animate-glow transition-all duration-300">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-gaming text-xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                GameZone
              </h1>
              <p className="text-xs text-gray-400 font-tech">Premium Rental</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' 
                      : 'hover:bg-dark-hover hover:text-neon-blue'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/booking"
                  className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
                >
                  Book Now
                </Link>
                
                {/* Admin Button */}
                {user.roles?.some(role => role.name === 'admin') && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-hover transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
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
                      className="absolute right-0 mt-2 w-48 bg-dark-card border border-neon-blue/20 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-dark-hover transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 text-neon-blue" />
                          <span className="text-white">Dashboard</span>
                        </Link>
                        
                        {user.roles?.some(role => role.name === 'admin') && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-dark-hover transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-neon-purple" />
                            <span className="text-white">Admin Panel</span>
                          </Link>
                        )}
                        
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
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-card hover:bg-dark-hover rounded-lg border border-neon-blue/30 hover:border-neon-blue transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-neon-green to-neon-blue text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
                >
                  Register
                </Link>
                <Link
                  to="/booking"
                  className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark-hover transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 border-t border-neon-blue/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' 
                        : 'hover:bg-dark-hover hover:text-neon-blue'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-700">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-dark-hover transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <div className="px-4 py-2 text-gray-300 text-sm">
                      Hi, {user.name}
                    </div>
                    <button
                      onClick={() => {handleLogout(); setIsMenuOpen(false);}}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600/30 transition-all duration-300 text-red-400 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-dark-hover transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center mt-2 px-4 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-white font-bold rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
                <Link
                  to="/booking"
                  className="flex items-center justify-center mt-2 px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;