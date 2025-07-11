import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Trophy, 
  Users, 
  MapPin, 
  Clock,
  DollarSign,
  Star,
  Gift,
  Zap,
  Target
} from 'lucide-react';
import { eventService } from '../services/api';
import { Event, ApiResponse } from '../types';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' | 'warning', isVisible: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, event: null as Event | null });

  useEffect(() => {
    fetchEvents();
    
    // Check user authentication
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response: ApiResponse<Event[]> = await eventService.getAll();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      showToast('Failed to load events. Please check your connection.', 'error');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (title: string) => {
    const icons: { [key: string]: string } = {
      'FIFA 24 Championship': '⚽',
      'PS5 Launch Party': '🎉',
      'Call of Duty Battle Royale': '🎯',
      'Retro Gaming Night': '🕹️'
    };
    return icons[title] || '🏆';
  };

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const featuredEvents = upcomingEvents.filter(event => event.is_featured);

  // Auto-slide featured events every 5 seconds
  useEffect(() => {
    if (featuredEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex(prev => (prev + 1) % featuredEvents.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredEvents.length]);

  const pastEvents = [
    {
      id: 5,
      title: 'Spider-Man Tournament',
      date: '2024-01-15',
      winner: 'ProGamer123',
      participants: 24,
      prize: 'Rp 1,000,000',
      image: '🕷️'
    },
    {
      id: 6,
      title: 'New Year Gaming Marathon',
      date: '2024-01-01',
      winner: 'TeamWin',
      participants: 40,
      prize: 'Gaming Gear',
      image: '🎊'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'ProGamer123', points: 2450, tournaments: 8, wins: 5 },
    { rank: 2, name: 'GameMaster', points: 2180, tournaments: 7, wins: 4 },
    { rank: 3, name: 'ElitePlayer', points: 1950, tournaments: 6, wins: 3 },
    { rank: 4, name: 'SkillzUp', points: 1720, tournaments: 5, wins: 2 },
    { rank: 5, name: 'ChampionX', points: 1500, tournaments: 4, wins: 2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-neon-green';
      case 'full': return 'text-yellow-400';
      case 'closed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'open': return 'bg-neon-green/20 border-neon-green/30';
      case 'full': return 'bg-yellow-400/20 border-yellow-400/30';
      case 'closed': return 'bg-red-400/20 border-red-400/30';
      default: return 'bg-gray-400/20 border-gray-400/30';
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
      
      const response = await fetch(`http://localhost:8000/api/v1/events/${event.id}/register`, {
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
        // Refresh events to update participant count
        fetchEvents();
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-gaming text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Events & Tournaments
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join exciting gaming events, compete in tournaments, and win amazing prizes!
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Connection Error</h3>
              <p className="text-gray-400 mb-6">Unable to load events. Please check your internet connection.</p>
              <button 
                onClick={fetchEvents}
                className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
              >
                🔄 Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Featured Event */}
        {!loading && !error && featuredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-lg p-8 mb-12 overflow-hidden border border-neon-blue/30"
            style={{
              backgroundImage: featuredEvents[currentFeaturedIndex]?.image_url 
                ? `url(${featuredEvents[currentFeaturedIndex]?.image_url})` 
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10"></div>
            <div className="absolute top-4 right-4 z-10">
              <span className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-full shadow-lg backdrop-blur-sm">
                FEATURED {featuredEvents.length > 1 && `${currentFeaturedIndex + 1}/${featuredEvents.length}`}
              </span>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {(() => {
                const event = featuredEvents[currentFeaturedIndex];
                return (
                <>
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-4xl">{getEventIcon(event.title)}</div>
                    <div>
                      <h2 className="font-gaming text-3xl font-bold text-white">
                        {event.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.event_date).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                      <div className="text-white font-bold">{event.prize_pool}</div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-6 h-6 text-neon-blue mx-auto mb-1" />
                      <div className="text-white font-bold">{event.participants_count || 0}/{event.max_participants}</div>
                      <div className="text-xs text-gray-400">Participants</div>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-neon-green mx-auto mb-1" />
                      <div className="text-white font-bold">{event.entry_fee === 0 ? 'Free' : `Rp ${event.entry_fee.toLocaleString()}`}</div>
                      <div className="text-xs text-gray-400">Entry Fee</div>
                    </div>
                    <div className="text-center">
                      <Target className="w-6 h-6 text-neon-purple mx-auto mb-1" />
                      <div className={`font-bold ${getStatusColor(event.status)}`}>
                        {event.status.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">Status</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleRegister(event)}
                      disabled={event.status === 'full' || event.status === 'closed'}
                      className={`px-8 py-3 font-bold rounded-lg transition-all duration-300 ${
                        event.status === 'full' || event.status === 'closed'
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:animate-glow'
                      }`}
                    >
                      {event.status === 'full' ? 'Event Full' : event.status === 'closed' ? 'Registration Closed' : 'Register Now'}
                    </button>
                    <Link 
                      to={`/events/${event.id}`}
                      className="px-6 py-3 border border-neon-blue/30 text-neon-blue hover:border-neon-blue hover:text-white rounded-lg transition-all duration-300 font-bold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                
                <div className="text-center">
                  {event.event_type === 'tournament' && event.game?.image_url ? (
                    <div className="relative">
                      <div className="relative w-64 h-64 mx-auto mb-4">
                        <img 
                          src={event.game.image_url} 
                          alt={event.game.title}
                          className="w-full h-full object-cover rounded-lg border-2 border-neon-blue/30 hover:border-neon-blue transition-all duration-300"
                        />
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> */}
                      </div>
                     
                    </div>
                  ) : (
                    <div>
                      <div className="text-9xl mb-4 animate-float">{getEventIcon(event.title)}</div>
                      <div className="text-sm text-gray-200 uppercase tracking-wider font-bold bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                        Featured {event.event_type === 'tournament' ? 'Tournament' : 'Event'}
                      </div>
                    </div>
                  )}
                </div>
                </>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {[
            { id: 'upcoming', label: 'Upcoming Events', icon: Calendar },
            { id: 'past', label: 'Past Events', icon: Trophy },
            { id: 'leaderboard', label: 'Leaderboard', icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-neon-blue text-white border border-neon-blue'
                    : 'bg-dark-card text-gray-400 hover:text-white hover:bg-dark-hover border border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Upcoming Events */}
        {activeTab === 'upcoming' && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {upcomingEvents.filter(event => !event.is_featured).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gradient-to-br from-dark-card to-dark-card/80 border border-gray-600 hover:border-neon-blue/50 rounded-xl overflow-hidden transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-neon-blue/20"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 ${event.image_url ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900`}>
                    <div className="text-6xl opacity-60">{getEventIcon(event.title)}</div>
                  </div>
                  
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${getStatusBg(event.status)} ${getStatusColor(event.status)}`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-black/50 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-white/20">
                      {event.event_type.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="p-6">
                
                <h3 className="font-gaming text-xl font-bold text-white mb-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Date & Time:</span>
                    <span className="text-white">
                      {new Date(event.event_date).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short' 
                      })} • {event.start_time.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prize:</span>
                    <span className="text-yellow-400 font-bold">{event.prize_pool}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className="text-neon-green font-bold">{event.entry_fee === 0 ? 'Free' : `Rp ${event.entry_fee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-white">{event.participants_count || 0}/{event.max_participants}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleRegister(event)}
                    disabled={event.status === 'full' || event.status === 'closed'}
                    className={`flex-1 py-2 font-bold rounded-lg transition-all duration-300 ${
                      event.status === 'full' || event.status === 'closed'
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:animate-glow'
                    }`}
                  >
                    {event.status === 'full' ? 'Full' : event.status === 'closed' ? 'Closed' : 'Register'}
                  </button>
                  <Link 
                    to={`/events/${event.id}`}
                    className="px-4 py-2 border border-gray-600 text-gray-400 hover:border-neon-blue hover:text-neon-blue rounded-lg transition-all duration-300 text-center"
                  >
                    Info
                  </Link>
                </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Past Events */}
        {activeTab === 'past' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-dark-card border border-gray-600 rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{event.image}</div>
                    <div>
                      <h3 className="font-gaming text-xl font-bold text-white mb-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{event.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold mb-1">
                      🏆 {event.winner}
                    </div>
                    <div className="text-sm text-gray-400">
                      {event.participants} participants • {event.prize}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-dark-card border border-neon-purple/20 rounded-lg p-6"
          >
            <h3 className="font-gaming text-xl font-bold text-neon-purple mb-6">
              Top Players
            </h3>
            
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    player.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30' 
                      : 'bg-dark-bg border border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1 ? 'bg-yellow-400 text-dark-bg' :
                      player.rank === 2 ? 'bg-gray-300 text-dark-bg' :
                      player.rank === 3 ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{player.name}</h4>
                      <p className="text-sm text-gray-400">
                        {player.tournaments} tournaments • {player.wins} wins
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-neon-purple font-bold">
                      {player.points} pts
                    </div>
                    {player.rank <= 3 && (
                      <div className="text-xs text-yellow-400">
                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/20 rounded-lg p-8 mt-12 text-center"
        >
          <Zap className="w-12 h-12 text-neon-green mx-auto mb-4" />
          <h3 className="font-gaming text-2xl font-bold text-white mb-4">
            Ready to Compete?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join our community of competitive gamers and start your journey to becoming a champion. 
            Register for upcoming tournaments and events!
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-white font-bold rounded-lg hover:animate-glow transition-all duration-300">
            View All Events
          </button>
        </motion.div>
      </div>
      
      {/* Toast Notification */}
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

export default Events;