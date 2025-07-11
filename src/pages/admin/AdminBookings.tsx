import React, { useState, useEffect } from 'react';
import { Eye, Edit } from 'lucide-react';
import { api } from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/bookings');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-gaming text-3xl font-bold text-white mt-6">Booking Management</h1>
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
                  <td className="py-3 px-4 text-gray-400">{formatDate(booking.booking_date)}</td>
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
  );
};

export default AdminBookings;