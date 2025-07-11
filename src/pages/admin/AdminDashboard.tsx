import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign,
  Activity,
  TrendingUp,
  Plus,
  Download
} from 'lucide-react';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/bookings')
      ]);
      
      setStats(statsRes.data || {});
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-8">
      <div>
        <h1 className="font-gaming text-3xl font-bold text-white mb-2 mt-6">Dashboard</h1>
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
  );
};

export default AdminDashboard;