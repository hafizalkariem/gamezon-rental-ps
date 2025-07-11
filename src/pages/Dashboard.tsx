import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Clock, 
  Trophy, 
  Star,
  Gift,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
  GamepadIcon,
  Loader
} from 'lucide-react';
import { api } from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [consoles, setConsoles] = useState([]);
  const [userStats, setUserStats] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    memberSince: new Date().getFullYear().toString(),
    totalBookings: 0,
    totalHours: 0,
    loyaltyPoints: 0,
    membershipLevel: 'Bronze'
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserStats(prev => ({
          ...prev,
          name: parsedUser.name || 'User',
          email: parsedUser.email || 'user@example.com'
        }));
      }
      
      const [bookingsRes, consolesRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/consoles')
      ]);
      
      console.log('Bookings API response:', bookingsRes);
      console.log('Consoles API response:', consolesRes);
      
      // Handle different response structures
      const bookingsData = bookingsRes.data || bookingsRes || [];
      const consolesData = consolesRes.data || consolesRes || [];
      
      // Filter bookings for current user if logged in
      let userBookings = bookingsData;
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Current user:', parsedUser);
        console.log('All bookings:', bookingsData);
        
        userBookings = bookingsData.filter(booking => {
          console.log('Checking booking:', booking.id, 'user_id:', booking.user_id, 'parsed user id:', parsedUser.id);
          // Check both user_id and customer info for backwards compatibility
          // Convert both to string for comparison to handle type differences
          return String(booking.user_id) === String(parsedUser.id) || 
                 (booking.customer_email === parsedUser.email && !booking.user_id);
        });
      }
      
      setBookings(userBookings);
      setConsoles(consolesData);
      
      // Calculate user stats from bookings
      const totalBookings = userBookings.length;
      const totalHours = userBookings.reduce((sum, booking) => sum + (parseInt(booking.duration_hours) || 0), 0);
      const loyaltyPoints = totalHours * 10; // 10 points per hour
      
      let membershipLevel = 'Bronze';
      if (loyaltyPoints >= 5000) membershipLevel = 'Platinum';
      else if (loyaltyPoints >= 2000) membershipLevel = 'Gold';
      else if (loyaltyPoints >= 500) membershipLevel = 'Silver';
      
      setUserStats(prev => ({
        ...prev,
        totalBookings,
        totalHours,
        loyaltyPoints,
        membershipLevel
      }));
      
      console.log('Filtered user bookings:', userBookings.length, userBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConsoleName = (consoleId) => {
    const console = consoles.find(c => c.id === consoleId);
    return console ? console.name : 'Unknown Console';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const recentBookings = bookings.slice(0, 3);

  const loyaltyRewards = [
    { name: 'Free 1 Hour Gaming', points: 500, available: true },
    { name: 'Snack Package', points: 300, available: true },
    { name: 'Gaming Headset Rental', points: 200, available: true },
    { name: 'VIP Room Access', points: 1000, available: false }
  ];

  const achievements = [
    { name: 'First Timer', description: 'Complete your first gaming session', earned: userStats.totalBookings > 0 },
    { name: 'Night Owl', description: 'Game after 10 PM', earned: userStats.totalBookings > 5 },
    { name: 'Marathon Gamer', description: 'Play for 6+ hours in one session', earned: userStats.totalHours > 50 },
    { name: 'Social Gamer', description: 'Play with 3+ friends', earned: false },
    { name: 'Loyalty Master', description: 'Reach 5000 loyalty points', earned: userStats.loyaltyPoints >= 5000 }
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="font-gaming text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400">Welcome back, {user ? userStats.name : 'Guest'}!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-dark-card border border-neon-blue/20 rounded-lg p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{userStats.name}</h3>
                  <p className="text-sm text-neon-purple">{userStats.membershipLevel} Member</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'bookings', label: 'My Bookings', icon: Calendar },
                  { id: 'loyalty', label: 'Loyalty Points', icon: Gift },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                          : 'hover:bg-dark-hover text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader className="w-8 h-8 text-neon-blue animate-spin" />
                  <span className="ml-2 text-gray-400">Loading dashboard...</span>
                </div>
              ) : (
                <>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-neon-blue" />
                            <span className="text-2xl font-bold text-white">{userStats.totalBookings}</span>
                          </div>
                          <p className="text-sm text-gray-400">Total Bookings</p>
                        </div>
                        
                        <div className="bg-dark-card border border-neon-purple/20 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 text-neon-purple" />
                            <span className="text-2xl font-bold text-white">{userStats.totalHours}</span>
                          </div>
                          <p className="text-sm text-gray-400">Gaming Hours</p>
                        </div>
                        
                        <div className="bg-dark-card border border-neon-green/20 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Gift className="w-8 h-8 text-neon-green" />
                            <span className="text-2xl font-bold text-white">{userStats.loyaltyPoints}</span>
                          </div>
                          <p className="text-sm text-gray-400">Loyalty Points</p>
                        </div>
                        
                        <div className="bg-dark-card border border-neon-pink/20 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Trophy className="w-8 h-8 text-neon-pink" />
                            <span className="text-2xl font-bold text-white">{userStats.membershipLevel}</span>
                          </div>
                          <p className="text-sm text-gray-400">Membership Level</p>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                        <h3 className="font-gaming text-xl font-bold text-neon-blue mb-4">Recent Activity</h3>
                        {recentBookings.length > 0 ? (
                          <div className="space-y-3">
                            {recentBookings.map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <GamepadIcon className="w-6 h-6 text-neon-purple" />
                                  <div>
                                    <p className="text-white font-medium">
                                      {getConsoleName(booking.console_id)} Gaming - {booking.duration_hours}h
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {formatDate(booking.booking_date)} at {booking.start_time}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-neon-green font-bold">
                                    Rp {booking.total_amount?.toLocaleString() || '0'}
                                  </p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    booking.status === 'completed' 
                                      ? 'bg-green-900 text-green-300'
                                      : booking.status === 'confirmed'
                                      ? 'bg-blue-900 text-blue-300' 
                                      : 'bg-yellow-900 text-yellow-300'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <GamepadIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No bookings yet. Start gaming!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bookings Tab */}
                  {activeTab === 'bookings' && (
                    <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                      <h3 className="font-gaming text-xl font-bold text-neon-blue mb-4">All My Bookings</h3>
                      {bookings.length > 0 ? (
                        <div className="space-y-4">
                          {bookings.map((booking) => (
                            <div key={booking.id} className="p-4 bg-dark-bg rounded-lg border border-gray-700">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-white font-medium">
                                    {getConsoleName(booking.console_id)} - {booking.duration_hours} Hours
                                  </h4>
                                  <p className="text-sm text-gray-400">
                                    {formatDate(booking.booking_date)} | {booking.start_time} - {booking.end_time}
                                  </p>
                                  {booking.notes && (
                                    <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-neon-green font-bold">
                                    Rp {booking.total_amount?.toLocaleString() || '0'}
                                  </p>
                                  <div className="flex space-x-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      booking.status === 'completed' 
                                        ? 'bg-green-900 text-green-300'
                                        : booking.status === 'confirmed'
                                        ? 'bg-blue-900 text-blue-300' 
                                        : 'bg-yellow-900 text-yellow-300'
                                    }`}>
                                      {booking.status}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      booking.payment_status === 'paid' 
                                        ? 'bg-green-900 text-green-300'
                                        : 'bg-red-900 text-red-300'
                                    }`}>
                                      {booking.payment_status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No bookings found.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loyalty Tab */}
                  {activeTab === 'loyalty' && (
                    <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                      <h3 className="font-gaming text-xl font-bold text-neon-blue mb-4">Loyalty Program</h3>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-neon-green mb-2">{userStats.loyaltyPoints}</div>
                        <p className="text-gray-400">Available Points</p>
                        <p className="text-sm text-neon-purple mt-2">{userStats.membershipLevel} Member</p>
                      </div>
                      <div className="space-y-3">
                        {loyaltyRewards.map((reward, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            reward.available 
                              ? 'border-neon-green/30 bg-neon-green/5' 
                              : 'border-gray-700 bg-gray-800/50'
                          }`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-white font-medium">{reward.name}</h4>
                                <p className="text-sm text-gray-400">{reward.points} points required</p>
                              </div>
                              <button 
                                disabled={!reward.available || userStats.loyaltyPoints < reward.points}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                  reward.available && userStats.loyaltyPoints >= reward.points
                                    ? 'bg-neon-green text-black hover:bg-neon-green/80'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {userStats.loyaltyPoints >= reward.points ? 'Redeem' : 'Not Available'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements Tab */}
                  {activeTab === 'achievements' && (
                    <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                      <h3 className="font-gaming text-xl font-bold text-neon-blue mb-4">Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map((achievement, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            achievement.earned 
                              ? 'border-neon-gold/30 bg-neon-gold/5' 
                              : 'border-gray-700 bg-gray-800/50'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <Trophy className={`w-8 h-8 ${
                                achievement.earned ? 'text-neon-gold' : 'text-gray-600'
                              }`} />
                              <div>
                                <h4 className={`font-medium ${
                                  achievement.earned ? 'text-neon-gold' : 'text-gray-400'
                                }`}>
                                  {achievement.name}
                                </h4>
                                <p className="text-sm text-gray-500">{achievement.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                      <h3 className="font-gaming text-xl font-bold text-neon-blue mb-4">Settings</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-2">Profile Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Name</label>
                              <input 
                                type="text" 
                                value={userStats.name}
                                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Email</label>
                              <input 
                                type="email" 
                                value={userStats.email}
                                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">Notifications</h4>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span className="text-gray-400">Email notifications</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span className="text-gray-400">Booking reminders</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;