import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Gamepad2, 
  Zap, 
  Star,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { consoleService, gameService } from '../services/api';

const Consoles = () => {
  const [consoles, setConsoles] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchConsoles();
    fetchGames();
  }, []);

  const fetchConsoles = async () => {
    try {
      setLoading(true);
      const response = await consoleService.getAll();
      setConsoles(response.data || []);
    } catch (error) {
      console.error('Error fetching consoles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await gameService.getAll();
      setGames(response.data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const getGamesCount = (consoleType) => {
    return games.filter(game => game.console_type === consoleType).length;
  };

  const getConsoleIcon = (type) => {
    const icons = {
      'ps5': '🎮',
      'ps4': '🕹️',
      'ps3': '🎯'
    };
    return icons[type] || '🎮';
  };

  const getConsoleColor = (type) => {
    const colors = {
      'ps5': 'neon-blue',
      'ps4': 'neon-purple',
      'ps3': 'neon-green'
    };
    return colors[type] || 'neon-blue';
  };

  const filteredConsoles = selectedType === 'all' 
    ? consoles 
    : consoles.filter(console => console.type === selectedType);

  const consoleTypes = ['all', 'ps5', 'ps4', 'ps3'];

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
              Gaming Consoles
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience gaming at its finest with our premium PlayStation console collection
          </p>
        </motion.div>

        {/* Console Type Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-2 flex space-x-2">
            {consoleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-neon-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}
              >
                {type === 'all' ? 'All Consoles' : type.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-neon-blue animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading consoles...</p>
          </div>
        )}

        {/* Consoles Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredConsoles.map((console, index) => {
              const color = getConsoleColor(console.type);
              return (
                <motion.div
                  key={console.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-dark-card border border-${color}/20 rounded-lg overflow-hidden group hover:border-${color}/50 transition-all duration-300 hover:transform hover:scale-105`}
                >
                  {/* Console Header */}
                  <div className={`bg-gradient-to-r from-${color}/20 to-${color}/10 p-6 relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{getConsoleIcon(console.type)}</div>
                      <div className="flex items-center space-x-2">
                        {console.status === 'available' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          console.status === 'available' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {console.status === 'available' ? 'Available' : 'Occupied'}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-gaming text-xl font-bold text-white mb-2">
                      {console.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{console.station}</p>
                    
                    <div className={`text-2xl font-bold text-${color} mb-2`}>
                      Rp {console.hourly_rate?.toLocaleString()}/hour
                    </div>
                  </div>

                  {/* Console Specifications */}
                  <div className="p-6">
                    <h4 className="font-bold text-white mb-4 flex items-center">
                      <Cpu className="w-5 h-5 mr-2 text-neon-blue" />
                      Specifications
                    </h4>
                    
                    <div className="space-y-3">
                      {console.specifications?.storage && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <HardDrive className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">Storage</span>
                          </div>
                          <span className="text-white font-medium">
                            {console.specifications.storage}
                          </span>
                        </div>
                      )}
                      
                      {console.specifications?.controllers && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Gamepad2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">Controllers</span>
                          </div>
                          <span className="text-white font-medium">
                            {console.specifications.controllers}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Total Games</span>
                        </div>
                        <span className="text-white font-medium">
                          {getGamesCount(console.type)} games
                        </span>
                      </div>
                      
                      {console.specifications?.features && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">Features</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {console.specifications.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 bg-${color}/20 text-${color} rounded text-xs font-medium`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <button
                        disabled={console.status !== 'available'}
                        className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                          console.status === 'available'
                            ? `bg-gradient-to-r from-${color} to-${color}/80 text-white hover:animate-glow`
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {console.status === 'available' ? 'Book Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Consoles */}
        {!loading && filteredConsoles.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No consoles found</p>
            <p className="text-gray-500">Try selecting a different console type</p>
          </div>
        )}

        {/* Console Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-dark-card border border-neon-purple/20 rounded-lg p-8"
        >
          <h2 className="font-gaming text-2xl font-bold text-white mb-6 text-center">
            Console Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Console</th>
                  <th className="text-left py-3 px-4 text-gray-400">Price/Hour</th>
                  <th className="text-left py-3 px-4 text-gray-400">Storage</th>
                  <th className="text-left py-3 px-4 text-gray-400">Controllers</th>
                  <th className="text-left py-3 px-4 text-gray-400">Key Features</th>
                </tr>
              </thead>
              <tbody>
                {['ps5', 'ps4', 'ps3'].map((type) => {
                  const typeConsoles = consoles.filter(c => c.type === type);
                  if (typeConsoles.length === 0) return null;
                  
                  const sampleConsole = typeConsoles[0];
                  const color = getConsoleColor(type);
                  
                  return (
                    <tr key={type} className="border-b border-gray-800 hover:bg-dark-hover">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getConsoleIcon(type)}</div>
                          <div>
                            <div className={`font-bold text-${color}`}>
                              {type.toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-400">
                              {typeConsoles.length} available
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold text-${color}`}>
                          Rp {sampleConsole.hourly_rate?.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {sampleConsole.specifications?.storage || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {sampleConsole.specifications?.controllers || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {sampleConsole.specifications?.features?.slice(0, 2).map((feature, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 bg-${color}/20 text-${color} rounded text-xs`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Consoles;