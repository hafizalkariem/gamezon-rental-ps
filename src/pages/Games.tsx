import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock,
  Gamepad2,
  Trophy,
  Heart,
  Zap
} from 'lucide-react';
import { gameService, api } from '../services/api';
import { Game, ApiResponse } from '../types';

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedConsole, setSelectedConsole] = useState('all');
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;
  const [featuredGameIndex, setFeaturedGameIndex] = useState(0);
  const [dominantColor, setDominantColor] = useState('#00D4FF');



  const consoles = [
    { id: 'all', name: 'All Consoles' },
    { id: 'ps3', name: 'PlayStation 3' },
    { id: 'ps4', name: 'PlayStation 4' },
    { id: 'ps5', name: 'PlayStation 5' }
  ];

  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response: ApiResponse<Game[]> = await gameService.getAll();
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch games');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      console.log('Genres response:', response);
      const genresData = response.data?.data || response.data || [];
      setGenres([{ id: 'all', name: 'all', display_name: 'All Genres' }, ...genresData]);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setGenres([{ id: 'all', name: 'all', display_name: 'All Genres' }]);
    }
  };

  const getGameIcon = (title: string) => {
    const icons: { [key: string]: string } = {
      'Spider-Man 2': '🕷️',
      'FIFA 24': '⚽',
      'Call of Duty: MW III': '🎯',
      'Gran Turismo 7': '🏎️',
      'God of War Ragnarök': '⚔️',
      'Tekken 8': '👊',
      'Elden Ring': '🗡️',
      'Horizon Forbidden West': '🏹'
    };
    return icons[title] || '🎮';
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || game.genre?.name === selectedGenre;
    const matchesConsole = selectedConsole === 'all' || game.console_type === selectedConsole;
    
    return matchesSearch && matchesGenre && matchesConsole;
  });

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, selectedConsole]);

  // Auto-rotate featured game every 5 seconds
  useEffect(() => {
    const ps5Games = games.filter(game => game.console_type === 'ps5');
    if (ps5Games.length === 0) return;

    const interval = setInterval(() => {
      setFeaturedGameIndex(prev => (prev + 1) % ps5Games.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [games]);

  const ps5Games = games.filter(game => game.console_type === 'ps5');
  const featuredGame = ps5Games.length > 0 ? ps5Games[featuredGameIndex] : null;

  const getGameColor = (gameTitle) => {
    const gameColors = {
      'Spider-Man 2': '#DC143C',
      'FIFA 24': '#00A651',
      'Call of Duty: Modern Warfare III': '#FF6B35',
      'Gran Turismo 7': '#1E90FF',
      'God of War Ragnarök': '#B8860B',
      'Tekken 8': '#FF1493',
      'Elden Ring': '#DAA520',
      'Horizon Forbidden West': '#FF4500',
      'Cyberpunk 2077': '#FFFF00',
      'Street Fighter 6': '#FF69B4',
      'Ghost of Tsushima': '#8B0000',
      'Red Dead Redemption 2': '#CD853F',
      'The Witcher 3: Wild Hunt': '#4B0082',
      'Need for Speed Heat': '#FF4500',
      'F1 23': '#FF0000'
    };
    return gameColors[gameTitle] || '#00D4FF';
  };

  useEffect(() => {
    if (featuredGame?.title) {
      setDominantColor(getGameColor(featuredGame.title));
    }
  }, [featuredGame]);

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
              Game Library
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our extensive collection of the latest and greatest games across all PlayStation consoles
          </p>
        </motion.div>

        {/* Featured Game */}
        {featuredGame && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-neon-blue/20 rounded-lg p-8 mb-12 relative overflow-hidden"
            style={{
              backgroundImage: featuredGame.image_url ? `url(${featuredGame.image_url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="absolute top-4 right-4 flex space-x-2">
              {featuredGame.is_new && (
                <span className="px-3 py-1 bg-neon-green text-dark-bg text-sm font-bold rounded-full">
                  NEW
                </span>
              )}
              {featuredGame.is_popular && (
                <span className="px-3 py-1 bg-neon-purple text-white text-sm font-bold rounded-full">
                  POPULAR
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h2 className="font-gaming text-3xl font-bold text-white mb-4">
                  {featuredGame.title}
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {featuredGame.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold">{featuredGame.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neon-blue">
                    <Users className="w-5 h-5" />
                    <span>{featuredGame.max_players} Players</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neon-green">
                    <Clock className="w-5 h-5" />
                    <span>{featuredGame.estimated_duration}</span>
                  </div>
                </div>
                
                <button 
                  className="px-6 py-3 bg-transparent border-2 text-white font-bold rounded-lg hover:animate-glow transition-all duration-300"
                  style={{
                    borderColor: dominantColor,
                    '--hover-bg': dominantColor
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = dominantColor;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  Play Now
                </button>
              </div>
              
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto mb-4">
                  {featuredGame.image_url ? (
                    <img 
                      src={featuredGame.image_url} 
                      alt={featuredGame.title}
                      className="w-full h-full object-cover rounded-lg border-2 border-neon-blue/30 hover:border-neon-blue transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full ${featuredGame.image_url ? 'hidden' : 'flex'} items-center justify-center bg-dark-card border-2 border-neon-blue/30 rounded-lg`}>
                    <div className="text-6xl animate-float">{getGameIcon(featuredGame.title)}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Featured Game</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-dark-card border border-neon-blue/20 rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
              />
            </div>
            
            {/* Genre Filter */}
            <div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
              >
                {genres.map(genre => (
                  <option key={genre.id} value={genre.name}>
                    {genre.display_name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Console Filter */}
            <div>
              <select
                value={selectedConsole}
                onChange={(e) => setSelectedConsole(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
              >
                {consoles.map(console => (
                  <option key={console.id} value={console.id}>
                    {console.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Loading games...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchGames}
              className="px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-blue/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Games Grid */}
        {!loading && !error && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative bg-gradient-to-br from-dark-card to-dark-card/80 border border-gray-700/50 hover:border-neon-blue/70 rounded-xl overflow-hidden group transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-neon-blue/20 backdrop-blur-sm"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Game Image */}
                  <div className="relative h-48 overflow-hidden">
                    {game.image_url ? (
                      <img 
                        src={game.image_url} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 ${game.image_url ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900`}>
                      <div className="text-5xl opacity-60 group-hover:opacity-80 transition-opacity duration-300">{getGameIcon(game.title)}</div>
                    </div>
                    
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <button 
                        onClick={() => {
                          const slug = game.title.toLowerCase()
                            .replace(/[^a-z0-9 -]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-');
                          window.location.href = `/games/${slug}`;
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-neon-blue to-blue-600 text-white rounded-xl font-semibold hover:from-neon-blue/90 hover:to-blue-600/90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-neon-blue/30 backdrop-blur-sm border border-neon-blue/30"
                      >
                        View Details
                      </button>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
                      {game.is_new && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-neon-green to-green-500 text-dark-bg text-xs font-bold rounded-full shadow-lg shadow-neon-green/30 backdrop-blur-sm border border-neon-green/30 animate-pulse">
                          NEW
                        </span>
                      )}
                      {game.is_popular && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-neon-purple to-purple-600 text-white text-xs font-bold rounded-full shadow-lg shadow-neon-purple/30 backdrop-blur-sm border border-neon-purple/30">
                          HOT
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="relative p-5 bg-gradient-to-b from-transparent to-dark-card/50">
                    <h3 className="font-bold text-white text-lg mb-3 line-clamp-1 group-hover:text-neon-blue transition-colors duration-300">
                      {game.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-xs font-semibold rounded-full border border-neon-blue/30">
                        {game.genre?.display_name || 'Unknown'}
                      </span>
                      <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-full border border-gray-600/50">
                        {game.console_type.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{game.rating}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <div className="flex items-center space-x-1.5 px-2 py-1 bg-gray-700/30 rounded-lg">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{game.max_players}</span>
                        </div>
                        {game.estimated_duration && (
                          <div className="flex items-center space-x-1.5 px-2 py-1 bg-gray-700/30 rounded-lg">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{game.estimated_duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-dark-card border border-gray-600 rounded-lg hover:border-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-neon-blue text-white'
                        : 'bg-dark-card border border-gray-600 hover:border-neon-blue text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-dark-card border border-gray-600 rounded-lg hover:border-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        
        {/* No Results */}
        {!loading && !error && filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No games found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;