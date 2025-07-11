import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Gamepad2, 
  Users, 
  CreditCard,
  CheckCircle,
  MapPin,
  Phone,
  AlertCircle,
  Monitor
} from 'lucide-react';
import { consoleService, bookingService, api } from '../services/api';
import { ApiResponse } from '../types';

const Booking = () => {
  const [bookingData, setBookingData] = useState({
    date: '',
    players: '1',
    extras: [],
    name: '',
    phone: '',
    email: ''
  });
  
  const [user, setUser] = useState(null);
  const [consoles, setConsoles] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [minDate, setMinDate] = useState('');

  const stations = ['Station 1', 'Station 2', 'Station 3'];
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  useEffect(() => {
    fetchConsoles();
    setMinDate(new Date().toISOString().split('T')[0]);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setBookingData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      }));
    }
  }, []);

  useEffect(() => {
    if (bookingData.date) {
      fetchAvailability();
    }
  }, [bookingData.date]);

  const fetchConsoles = async () => {
    try {
      const response = await api.get('/consoles?with=stations');
      setConsoles(response.data || []);
    } catch (error) {
      console.error('Error fetching consoles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!bookingData.date) return;
    
    setLoadingAvailability(true);
    try {
      const response = await bookingService.checkAvailability({ date: bookingData.date });

      setBookedSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      showAlert('Gagal memuat ketersediaan waktu', 'error');
    } finally {
      setLoadingAvailability(false);
    }
  };

  const isTimeSlotBooked = (consoleStationId, time) => {
    if (!bookingData.date || !consoleStationId) {
      return false;
    }
    
    const isBooked = bookedSlots.some(booking => {
      const sameConsoleStation = booking.console_station_id === parseInt(consoleStationId);
      const timeConflict = isTimeInRange(time, booking.start_time, booking.end_time);
      
      // Since backend already filters by date, we don't need to check date again
      return sameConsoleStation && timeConflict;
    });
    
    return isBooked;
  };

  const isTimeInRange = (time, startTime, endTime) => {
    const timeHour = parseInt(time.split(':')[0]);
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    return timeHour >= startHour && timeHour < endHour;
  };

  const toggleTimeSlot = (consoleStationId, time, hourlyRate, gameConsole, station) => {
    const slotKey = `${gameConsole.id}-${station}-${time}`; // Match the key format
    const existingSlotIndex = selectedSlots.findIndex(slot => 
      slot.slotKey === slotKey
    );



    if (existingSlotIndex !== -1) {
      setSelectedSlots(selectedSlots.filter((_, index) => index !== existingSlotIndex));
    } else {
      setSelectedSlots([...selectedSlots, { consoleStationId, time, hourlyRate, slotKey, gameConsole, station }]);
    }
  };

  const extras = [
    { id: 'headset', name: 'Gaming Headset', price: 5000 },
    { id: 'snacks', name: 'Snack Package', price: 15000 },
    { id: 'drinks', name: 'Drinks Package', price: 10000 },
    { id: 'vr', name: 'VR Experience', price: 20000 }
  ];

  const calculateTotal = () => {
    const slotsPrice = selectedSlots.reduce((sum, slot) => sum + slot.hourlyRate, 0);
    const extrasPrice = bookingData.extras.reduce((sum, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return sum + (extra ? extra.price : 0);
    }, 0);
    return slotsPrice + extrasPrice;
  };

  const showAlert = (message: string, type: string) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSlots.length === 0) {
      showAlert('Pilih minimal satu slot waktu', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const totalAmount = calculateTotal();
      
      const extrasPrice = bookingData.extras.reduce((sum, extraId) => {
        const extra = extras.find(e => e.id === extraId);
        return sum + (extra ? extra.price : 0);
      }, 0);

      // Create individual booking for each selected slot (like cinema seats)
      for (const slot of selectedSlots) {
        // Skip if consoleStationId is not a valid number
        if (isNaN(parseInt(slot.consoleStationId))) {
          console.warn('Skipping slot with invalid consoleStationId:', slot);
          continue;
        }
        
        const bookingPayload = {
          console_station_id: parseInt(slot.consoleStationId),
          booking_date: bookingData.date,
          start_time: slot.time,
          duration_hours: 1, // Each slot is 1 hour
          total_amount: slot.hourlyRate + (extrasPrice / selectedSlots.length),
          notes: `Players: ${bookingData.players}, Extras: ${bookingData.extras.join(', ')}`,
          ...(user ? {
            user_id: user.id
          } : {
            customer_name: bookingData.name,
            customer_phone: bookingData.phone,
            customer_email: bookingData.email
          })
        };

        await bookingService.create(bookingPayload);
      }

      showAlert('Booking berhasil! Kami akan menghubungi Anda segera.', 'success');
      
      // Refresh availability
      await fetchAvailability();
      
      // Reset form
      setSelectedSlots([]);
      setBookingData({
        date: '',
        players: '1',
        extras: [],
        name: user?.name || '',
        phone: '',
        email: user?.email || ''
      });
      
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Terjadi kesalahan saat booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Alert */}
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg border flex items-center space-x-3 ${
              alert.type === 'success' 
                ? 'bg-green-600/20 border-green-500/30 text-green-400'
                : 'bg-red-600/20 border-red-500/30 text-red-400'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{alert.message}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-gaming text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Book Your Gaming Session
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pilih tanggal, waktu, dan konsol untuk pengalaman gaming terbaik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-dark-card border border-neon-blue/20 rounded-lg p-8 space-y-8"
            >
              {/* Date Selection */}
              <div className="space-y-6">
                <h3 className="font-gaming text-xl font-bold text-neon-blue flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Pilih Tanggal
                </h3>
                
                <input
                  type="date"
                  value={bookingData.date}
                  min={minDate}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                  required
                />
              </div>

              {/* Console & Time Selection Tables */}
              {bookingData.date && (
                <div className="space-y-8">
                  <h3 className="font-gaming text-xl font-bold text-neon-blue flex items-center">
                    <Monitor className="w-6 h-6 mr-2" />
                    Pilih Console & Waktu
                    {loadingAvailability && (
                      <div className="ml-3 animate-spin rounded-full h-4 w-4 border-b-2 border-neon-blue"></div>
                    )}
                  </h3>
                  
                  {stations.map(station => (
                    <div key={station} className="space-y-4">
                      <h4 className="font-bold text-lg text-neon-purple">{station}</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-600 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-dark-card">
                              <th className="px-4 py-3 text-left text-white font-medium border-r border-gray-600">Console</th>
                              {timeSlots.map(time => (
                                <th key={time} className="px-2 py-3 text-center text-white font-medium border-r border-gray-600 min-w-[80px]">
                                  {time}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {consoles.filter(gameConsole => gameConsole.stations && gameConsole.stations.some(s => s.name === station)).map(gameConsole => {
                              const consoleStation = gameConsole.stations.find(s => s.name === station);
                              const consoleStationId = consoleStation?.pivot?.id;
                              
                              return (
                              <tr key={`${gameConsole.id}-${station}`} className="border-t border-gray-600">
                                <td className="px-4 py-3 border-r border-gray-600">
                                  <div className="text-white font-medium">{gameConsole.name}</div>
                                  <div className="text-sm text-gray-400">{gameConsole.type?.toUpperCase()}</div>
                                  <div className="text-xs text-neon-blue">Rp {gameConsole.hourly_rate?.toLocaleString()}/jam</div>
                                </td>
                                {timeSlots.map(time => {
                                  const isBooked = isTimeSlotBooked(consoleStationId, time);
                                  const isUnavailable = gameConsole.status !== 'available';
                                  const slotKey = `${gameConsole.id}-${station}-${time}`;
                                  const isSelected = selectedSlots.some(slot => 
                                    slot.slotKey === slotKey
                                  );
                                  
                                  return (
                                    <td key={time} className="px-2 py-3 text-center border-r border-gray-600">
                                      {isBooked ? (
                                        <div className="relative w-full h-8 rounded text-xs font-medium bg-gradient-to-r from-red-600/80 to-red-800/80 border border-red-500/50 flex items-center justify-center overflow-hidden">
                                          <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                                          <div className="relative z-10 flex items-center space-x-1">
                                            <svg className="w-3 h-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-red-200 font-bold text-[10px]">BOOKED</span>
                                          </div>
                                        </div>
                                      ) : isUnavailable ? (
                                        <div className={`relative w-full h-8 rounded text-xs font-medium border flex items-center justify-center overflow-hidden ${
                                          gameConsole.status === 'maintenance' 
                                            ? 'bg-gradient-to-r from-yellow-600/80 to-orange-600/80 border-yellow-500/50'
                                            : 'bg-gradient-to-r from-gray-600/80 to-gray-800/80 border-gray-500/50'
                                        }`}>
                                          <div className={`absolute inset-0 animate-pulse ${
                                            gameConsole.status === 'maintenance' ? 'bg-yellow-500/10' : 'bg-gray-500/10'
                                          }`}></div>
                                          <div className="relative z-10 flex items-center space-x-1">
                                            {gameConsole.status === 'maintenance' ? (
                                              <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                              </svg>
                                            ) : (
                                              <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM4 10a6 6 0 1112 0A6 6 0 014 10z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                            <span className={`font-bold text-[9px] ${
                                              gameConsole.status === 'maintenance' ? 'text-yellow-200' : 'text-gray-200'
                                            }`}>
                                              {gameConsole.status === 'maintenance' ? 'MAINTENANCE' : 'OCCUPIED'}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled={loadingAvailability || !consoleStationId}
                                          onClick={() => consoleStationId && toggleTimeSlot(consoleStationId, time, gameConsole.hourly_rate, gameConsole, station)}
                                          className={`group relative w-full h-8 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                                            !consoleStationId
                                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                              : isSelected
                                              ? 'bg-gradient-to-r from-neon-blue to-blue-600 text-white shadow-lg shadow-neon-blue/25'
                                              : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-200 hover:text-white border border-gray-600/50 hover:border-gray-500/70'
                                          }`}
                                        >
                                          <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                          <span className="relative z-10 flex items-center justify-center">
                                            {!consoleStationId ? (
                                              'N/A'
                                            ) : isSelected ? (
                                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            ) : (
                                              <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                          </span>
                                        </button>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Players Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jumlah Pemain
                </label>
                <select
                  value={bookingData.players}
                  onChange={(e) => setBookingData({...bookingData, players: e.target.value})}
                  className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                  required
                >
                  {[1,2,3,4].map(player => (
                    <option key={player} value={player}>{player} Orang</option>
                  ))}
                </select>
              </div>

              {/* Extras */}
              <div className="space-y-6">
                <h3 className="font-gaming text-xl font-bold text-neon-green flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Fasilitas Tambahan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extras.map(extra => (
                    <label
                      key={extra.id}
                      className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:border-neon-green/50 cursor-pointer transition-all duration-300"
                    >
                      <input
                        type="checkbox"
                        checked={bookingData.extras.includes(extra.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBookingData({
                              ...bookingData,
                              extras: [...bookingData.extras, extra.id]
                            });
                          } else {
                            setBookingData({
                              ...bookingData,
                              extras: bookingData.extras.filter(id => id !== extra.id)
                            });
                          }
                        }}
                        className="w-4 h-4 text-neon-green bg-dark-bg border-gray-600 rounded focus:ring-neon-green focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">{extra.name}</div>
                        <div className="text-sm text-neon-green font-bold">
                          +Rp {extra.price.toLocaleString()}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Info - Only show if not logged in */}
              {!user && (
                <div className="space-y-6">
                  <h3 className="font-gaming text-xl font-bold text-neon-blue flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    Informasi Pemesan
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                      required
                    />
                  </div>
                </div>
              )}
              
              {/* Logged in user info */}
              {user && (
                <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-lg p-4">
                  <h4 className="text-neon-blue font-medium mb-2">Booking sebagai:</h4>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || selectedSlots.length === 0 || (!user && (!bookingData.name || !bookingData.email || !bookingData.phone))}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Book Now - Rp {calculateTotal().toLocaleString()}</span>
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-dark-card border border-neon-purple/20 rounded-lg p-6 sticky top-24"
            >
              <h3 className="font-gaming text-xl font-bold text-neon-purple mb-6">
                Booking Summary
              </h3>
              
              <div className="space-y-4">
                {bookingData.date && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white font-medium">{bookingData.date}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Players:</span>
                  <span className="text-white font-medium">{bookingData.players}</span>
                </div>

                {selectedSlots.length > 0 && (
                  <div>
                    <span className="text-gray-400 block mb-2">Selected Slots ({selectedSlots.length}):</span>
                    {selectedSlots.map((slot, index) => {
                      const gameConsole = consoles.find(c => 
                        c.stations && c.stations.some(s => s.pivot?.id === slot.consoleStationId)
                      );
                      const station = gameConsole?.stations?.find(s => s.pivot?.id === slot.consoleStationId);
                      return (
                        <div key={slot.slotKey || index} className="flex justify-between items-center ml-4 text-sm mb-1">
                          <span className="text-gray-300">{gameConsole?.name} ({station?.name}) - {slot.time}</span>
                          <span className="text-neon-blue">Rp {slot.hourlyRate.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {bookingData.extras.length > 0 && (
                  <div>
                    <span className="text-gray-400 block mb-2">Extras:</span>
                    {bookingData.extras.map(extraId => {
                      const extra = extras.find(e => e.id === extraId);
                      return extra ? (
                        <div key={extraId} className="flex justify-between items-center ml-4">
                          <span className="text-sm text-gray-300">{extra.name}</span>
                          <span className="text-sm text-neon-green">+Rp {extra.price.toLocaleString()}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-neon-purple">Rp {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;