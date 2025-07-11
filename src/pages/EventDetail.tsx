import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Trophy, 
  Users, 
  MapPin, 
  Clock,
  DollarSign,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import { eventService } from '../services/api';
import { Event, ApiResponse } from '../types';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' | 'warning', isVisible: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, event: null as Event | null });

  useEffect(() => {
    if (id) {
      fetchEventDetail(id);
    }
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [id]);

  const fetchEventDetail = async (eventId: string) => {
    try {
      setLoading(true);
      const response: ApiResponse<Event> = await eventService.getById(eventId);
      setEvent(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, isVisible: true });
  };

  const handleRegister = async (event: Event) => {
    // Check if user is logged in
    if (!user) {
      showToast('Please login first to register for events', 'warning');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    // Check event status
    if (event.status === 'full') {
      showToast('Sorry, this event is full!', 'error');
      return;
    }

    if (event.status === 'closed') {
      showToast('Registration for this event is closed.', 'error');
      return;
    }

    // Show confirmation modal
    setConfirmModal({ isOpen: true, event });
  };

  const handleConfirmRegistration = async () => {
    const event = confirmModal.event;
    if (!event) return;
    
    setConfirmModal({ isOpen: false, event: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        showToast('Please login first', 'warning');
        setTimeout(() => window.location.href = '/login', 1500);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        showToast('Registration successful! You will receive a confirmation email shortly.', 'success');
        // Refresh event to update participant count
        fetchEventDetail(id!);
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-neon-green';
      case 'full': return 'text-yellow-400';
      case 'closed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Event Not Found</h3>
          <p className="text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link 
            to="/events"
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section with Split Layout - Full Screen */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen overflow-hidden"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-8 z-20"
        >
          <Link 
            to="/events"
            className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors duration-300 bg-dark-bg/80 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
        </motion.div>
        {/* Background Image - Right Side */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: event.image_url ? `url(${event.image_url})` : 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)'
          }}
        ></div>
        
        {/* Elliptical Mask */}
        <div 
          className="absolute inset-0 bg-dark-bg"
          style={{
            clipPath: 'polygon(0% 0%, 60% 0%, 40% 50%, 60% 100%, 0% 100%)',
            filter: 'drop-shadow(2px 0 8px rgba(0, 212, 255, 0.6))'
          }}
        ></div>
        
        {/* Content - Left Side */}
        <div className="relative h-full flex items-center">
          <div className="w-1/2 pl-16 pr-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-4">
                <div className={`inline-block px-6 py-3 rounded-full border backdrop-blur-sm ${event.status === 'open' ? 'bg-neon-green/20 border-neon-green/50 text-neon-green' : event.status === 'full' ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400' : 'bg-red-400/20 border-red-400/50 text-red-400'} font-bold text-lg`}>
                  {event.status.toUpperCase()}
                </div>
              </div>
              
              <h1 className="font-gaming text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                <span className="bg-gradient-neon bg-clip-text text-transparent">
                  {event.title}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                {event.description}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-dark-card/80 backdrop-blur-sm border border-neon-blue/30 rounded-xl p-4 hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300">
                  <Calendar className="w-6 h-6 text-neon-blue mb-2" />
                  <h3 className="font-gaming text-sm font-bold text-white mb-1">Date</h3>
                  <p className="text-gray-300 text-sm">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-dark-card/80 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-4 hover:border-neon-purple hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300">
                  <Trophy className="w-6 h-6 text-neon-purple mb-2" />
                  <h3 className="font-gaming text-sm font-bold text-white mb-1">Prize</h3>
                  <p className="text-yellow-400 font-bold text-sm">{event.prize_pool}</p>
                </div>
                
                <div className="bg-dark-card/80 backdrop-blur-sm border border-neon-green/30 rounded-xl p-4 hover:border-neon-green hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all duration-300">
                  <Users className="w-6 h-6 text-neon-green mb-2" />
                  <h3 className="font-gaming text-sm font-bold text-white mb-1">Players</h3>
                  <p className="text-white font-bold text-sm">{event.participants_count || 0}/{event.max_participants}</p>                </div>
                
                <div className="bg-dark-card/80 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(255,255,0,0.3)] transition-all duration-300">
                  <DollarSign className="w-6 h-6 text-yellow-400 mb-2" />
                  <h3 className="font-gaming text-sm font-bold text-white mb-1">Fee</h3>
                  <p className="text-neon-green font-bold text-sm">{event.entry_fee === 0 ? 'FREE' : `Rp ${event.entry_fee.toLocaleString()}`}</p>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-center space-x-2 mb-8 text-gray-300">
                <MapPin className="w-5 h-5 text-neon-blue" />
                <span className="text-lg">{event.location}</span>
              </div>
              
              {/* Register Button */}
              <button
                onClick={() => handleRegister(event)}
                disabled={event.status === 'full' || event.status === 'closed'}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  event.status === 'full' || event.status === 'closed'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:animate-glow hover:scale-105'
                }`}
              >
                {event.status === 'full' ? '❌ Event Full' : event.status === 'closed' ? '🔒 Registration Closed' : '🎮 Register Now'}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Additional Actions */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center space-x-4"
        >
          <button className="flex items-center space-x-2 px-6 py-3 border border-neon-blue/30 text-neon-blue rounded-lg hover:bg-neon-blue/10 transition-all duration-300">
            <Heart className="w-5 h-5" />
            <span>Save Event</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 border border-neon-purple/30 text-neon-purple rounded-lg hover:bg-neon-purple/10 transition-all duration-300">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </motion.div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Confirm Registration"
        message={confirmModal.event ? `Register for ${confirmModal.event.title}?\n\nEntry Fee: ${confirmModal.event.entry_fee === 0 ? 'Free' : `Rp ${confirmModal.event.entry_fee.toLocaleString()}`}\nDate: ${new Date(confirmModal.event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
        confirmText="Register Now"
        cancelText="Cancel"
        onConfirm={handleConfirmRegistration}
        onCancel={() => setConfirmModal({ isOpen: false, event: null })}
      />
    </div>
  );
};

export default EventDetail;