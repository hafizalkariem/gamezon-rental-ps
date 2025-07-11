import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  Calendar,
  Monitor,
  Gamepad2,
  Play,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { gameService } from '../services/api';

const GameDetail = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchGame();
  }, [slug]);

  const createSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const fetchGame = async () => {
    try {
      setLoading(true);
      const response = await gameService.getAll();
      const games = response.data || [];
      const foundGame = games.find(g => createSlug(g.title) === slug);
      setGame(foundGame);
      
      if (foundGame) {
        const related = getRelatedGames(foundGame, games);
        setRelatedGames(related);
      }
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedGames = (currentGame, allGames) => {
    const otherGames = allGames.filter(g => g.id !== currentGame.id);
    
    // Priority scoring system
    const scoredGames = otherGames.map(game => {
      let score = 0;
      
      // Same genre gets highest priority
      if (game.genre?.id === currentGame.genre?.id) score += 10;
      
      // Same console type
      if (game.console_type === currentGame.console_type) score += 8;
      
      // Similar player count
      if (Math.abs(game.max_players - currentGame.max_players) <= 1) score += 5;
      
      // Popular games get bonus
      if (game.is_popular) score += 3;
      
      // New games get bonus
      if (game.is_new) score += 2;
      
      // Similar rating (within 0.5)
      if (Math.abs(game.rating - currentGame.rating) <= 0.5) score += 4;
      
      return { ...game, score };
    });
    
    // Sort by score and add randomness
    const sorted = scoredGames
      .sort((a, b) => b.score - a.score)
      .slice(0, 8) // Take top 8
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, 4); // Take 4 random from top matches
    
    return sorted;
  };

  const getConsoleColor = (type) => {
    const colors = {
      'ps5': 'neon-blue',
      'ps4': 'neon-purple', 
      'ps3': 'neon-green'
    };
    return colors[type] || 'neon-blue';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game Not Found</h1>
          <Link to="/games" className="text-neon-blue hover:underline">
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  const consoleColor = getConsoleColor(game.console_type);

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/games"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Game Media */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-dark-card">
              {game.image_url ? (
                <img 
                  src={game.image_url}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gamepad2 className="w-16 h-16 text-gray-600" />
                </div>
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index}
                  className="aspect-video bg-dark-card rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedImage(index)}
                >
                  {game.image_url && (
                    <img 
                      src={game.image_url}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 bg-${consoleColor}/20 text-${consoleColor} rounded-full text-sm font-medium`}>
                  {game.console_type.toUpperCase()}
                </span>
                {game.is_new && (
                  <span className="px-3 py-1 bg-neon-green text-dark-bg rounded-full text-sm font-bold">
                    NEW
                  </span>
                )}
                {game.is_popular && (
                  <span className="px-3 py-1 bg-neon-purple text-white rounded-full text-sm font-bold">
                    POPULAR
                  </span>
                )}
              </div>
              
              <h1 className="font-gaming text-3xl md:text-4xl font-bold text-white mb-4">
                {game.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-bold">{game.rating}</span>
                  <span className="text-gray-400">/5</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{game.genre?.display_name}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">About This Game</h3>
              <p className="text-gray-300 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Game Details */}
            <div className="bg-dark-card rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Game Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Players</p>
                    <p className="text-white font-medium">{game.max_players}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-medium">{game.estimated_duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Release Date</p>
                    <p className="text-white font-medium">{formatDate(game.release_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Platform</p>
                    <p className="text-white font-medium">{game.console_type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button className={`w-full py-4 bg-gradient-to-r from-${consoleColor} to-${consoleColor}/80 text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 flex items-center justify-center space-x-2`}>
                <Gamepad2 className="w-5 h-5" />
                <span>Book Now to Play</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedGames.map((relatedGame) => {
                const relatedSlug = createSlug(relatedGame.title);
                const relatedColor = getConsoleColor(relatedGame.console_type);
                return (
                  <Link 
                    key={relatedGame.id}
                    to={`/games/${relatedSlug}`}
                    className="bg-dark-card rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="aspect-video bg-gray-700 relative overflow-hidden">
                      {relatedGame.image_url ? (
                        <img 
                          src={relatedGame.image_url}
                          alt={relatedGame.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Console Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 bg-${relatedColor}/20 text-${relatedColor} rounded text-xs font-medium`}>
                          {relatedGame.console_type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-2 line-clamp-2 text-sm">
                        {relatedGame.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{relatedGame.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {relatedGame.genre?.display_name}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;