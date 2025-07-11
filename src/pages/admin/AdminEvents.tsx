import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                <span className="text-white">{formatDate(event.event_date)}</span>
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
  );
};

export default AdminEvents;