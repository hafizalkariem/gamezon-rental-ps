import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Gamepad2, 
  Trophy, 
  CreditCard,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, bookingsRes, gamesRes, eventsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/bookings'),
        api.get('/games'),
        api.get('/events')
      ]);
      
      setStats(statsRes.data || {});
      setUsers(usersRes.data || []);
      setBookings(bookingsRes.data || []);
      setGames(gamesRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'events', label: 'Events', icon: Trophy },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`bg-dark-card border border-${color}/20 rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-dark-card border-r border-neon-blue/20 min-h-screen">
          <div className="p-6">
            <h2 className="font-gaming text-xl font-bold text-neon-blue mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-gaming text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome to GameZone Admin Panel</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.total_users || 0}
                  icon={Users}
                  color="neon-blue"
                  trend={12}
                />
                <StatCard
                  title="Total Bookings"
                  value={stats.total_bookings || 0}
                  icon={Calendar}
                  color="neon-purple"
                  trend={8}
                />
                <StatCard
                  title="Monthly Revenue"
                  value={`Rp ${(stats.monthly_revenue || 0).toLocaleString()}`}
                  icon={DollarSign}
                  color="neon-green"
                  trend={15}
                />
                <StatCard
                  title="Active Consoles"
                  value={stats.total_consoles || 0}
                  icon={Activity}
                  color="neon-pink"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                  <h3 className="font-gaming text-xl font-bold text-neon-blue mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                        <div>
                          <p className="text-white font-medium">{booking.customer_name || 'User'}</p>
                          <p className="text-sm text-gray-400">{booking.booking_date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-card border border-neon-purple/20 rounded-lg p-6">
                  <h3 className="font-gaming text-xl font-bold text-neon-purple mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 bg-neon-blue/20 hover:bg-neon-blue/30 rounded-lg transition-colors">
                      <Plus className="w-5 h-5 text-neon-blue" />
                      <span className="text-white">Add New Game</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-neon-green/20 hover:bg-neon-green/30 rounded-lg transition-colors">
                      <Calendar className="w-5 h-5 text-neon-green" />
                      <span className="text-white">Create Event</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-neon-purple/20 hover:bg-neon-purple/30 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-neon-purple" />
                      <span className="text-white">Export Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-gaming text-3xl font-bold text-white">User Management</h1>
                <button className="flex items-center space-x-2 px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg hover:border-neon-blue transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Name</th>
                        <th className="text-left py-3 px-4 text-gray-400">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400">Role</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-dark-hover">
                          <td className="py-3 px-4 text-white">{user.name}</td>
                          <td className="py-3 px-4 text-gray-400">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs">
                              {user.roles?.[0]?.name || 'user'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="p-1 hover:bg-neon-blue/20 rounded">
                                <Eye className="w-4 h-4 text-neon-blue" />
                              </button>
                              <button className="p-1 hover:bg-neon-green/20 rounded">
                                <Edit className="w-4 h-4 text-neon-green" />
                              </button>
                              <button className="p-1 hover:bg-red-600/20 rounded">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-gaming text-3xl font-bold text-white">Booking Management</h1>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-neon-green hover:bg-neon-green/80 rounded-lg transition-colors">
                    Export
                  </button>
                </div>
              </div>

              <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">ID</th>
                        <th className="text-left py-3 px-4 text-gray-400">Customer</th>
                        <th className="text-left py-3 px-4 text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400">Console</th>
                        <th className="text-left py-3 px-4 text-gray-400">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-800 hover:bg-dark-hover">
                          <td className="py-3 px-4 text-white">#{booking.id}</td>
                          <td className="py-3 px-4 text-white">{booking.customer_name || 'User'}</td>
                          <td className="py-3 px-4 text-gray-400">{booking.booking_date}</td>
                          <td className="py-3 px-4 text-gray-400">Console {booking.console_id}</td>
                          <td className="py-3 px-4 text-gray-400">{booking.duration_hours}h</td>
                          <td className="py-3 px-4 text-neon-green">Rp {booking.total_amount?.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-600/20 text-green-400'
                                : booking.status === 'pending'
                                ? 'bg-yellow-600/20 text-yellow-400'
                                : 'bg-blue-600/20 text-blue-400'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="p-1 hover:bg-neon-blue/20 rounded">
                                <Eye className="w-4 h-4 text-neon-blue" />
                              </button>
                              <button className="p-1 hover:bg-neon-green/20 rounded">
                                <Edit className="w-4 h-4 text-neon-green" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-gaming text-3xl font-bold text-white">Game Management</h1>
                <button className="flex items-center space-x-2 px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Game</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div key={game.id} className="bg-dark-card border border-neon-purple/20 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white">{game.title}</h3>
                      <div className="flex space-x-1">
                        <button className="p-1 hover:bg-neon-green/20 rounded">
                          <Edit className="w-4 h-4 text-neon-green" />
                        </button>
                        <button className="p-1 hover:bg-red-600/20 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{game.genre}</p>
                    <p className="text-gray-400 text-sm mb-4">{game.console_type}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-neon-purple font-bold">★ {game.rating}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        game.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                      }`}>
                        {game.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-gaming text-3xl font-bold text-white">Event Management</h1>
                <button className="flex items-center space-x-2 px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-dark-card border border-neon-gold/20 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white text-lg">{event.title}</h3>
                      <div className="flex space-x-1">
                        <button className="p-1 hover:bg-neon-green/20 rounded">
                          <Edit className="w-4 h-4 text-neon-green" />
                        </button>
                        <button className="p-1 hover:bg-red-600/20 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{event.event_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prize Pool:</span>
                        <span className="text-neon-gold">Rp {event.prize_pool?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.status === 'upcoming' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <h1 className="font-gaming text-3xl font-bold text-white">Transaction Management</h1>
              <div className="bg-dark-card border border-neon-green/20 rounded-lg p-6">
                <p className="text-gray-400">Transaction management coming soon...</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="font-gaming text-3xl font-bold text-white">Settings</h1>
              <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-6">
                <p className="text-gray-400">System settings coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;