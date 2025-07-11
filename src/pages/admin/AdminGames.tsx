import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre_id: '',
    console_type: 'ps5',
    rating: '',
    max_players: '',
    estimated_duration: '',
    description: '',
    image_url: '',
    is_popular: false,
    is_new: false,
    release_date: ''
  });

  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (editingGame) {
      const newFormData = {
        title: editingGame.title || '',
        genre_id: String(editingGame.genre_id || ''),
        console_type: editingGame.console_type || 'ps5',
        rating: editingGame.rating ? String(editingGame.rating) : '',
        max_players: editingGame.max_players ? String(editingGame.max_players) : '',
        estimated_duration: editingGame.estimated_duration || '',
        description: editingGame.description || '',
        image_url: editingGame.image_url || '',
        is_popular: editingGame.is_popular || false,
        is_new: editingGame.is_new || false,
        release_date: editingGame.release_date ? editingGame.release_date.split('T')[0] : ''
      };
      setFormData(newFormData);
    }
  }, [editingGame]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/games');
      setGames(response.data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      console.log('Genres API response:', response);
      // Handle both response.data.data and response.data structures
      const genresData = response.data?.data || response.data || [];
      console.log('Genres data:', genresData);
      setGenres(genresData);
    } catch (error) {
      console.error('Error fetching genres:', error);
      // Set empty array on error to prevent undefined
      setGenres([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...formData,
        genre_id: parseInt(formData.genre_id),
        rating: formData.rating ? parseFloat(formData.rating) : null,
        max_players: formData.max_players ? parseInt(formData.max_players) : null,
        is_active: true
      };
      
      await api.post('/games', gameData);
      setShowModal(false);
      setFormData({
        title: '',
        genre_id: '',
        console_type: 'ps5',
        rating: '',
        max_players: '',
        estimated_duration: '',
        description: '',
        image_url: '',
        is_popular: false,
        is_new: false,
        release_date: ''
      });
      fetchGames();
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game. Please check the form.');
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...formData,
        genre_id: parseInt(formData.genre_id),
        rating: formData.rating ? parseFloat(formData.rating) : null,
        max_players: formData.max_players ? parseInt(formData.max_players) : null
      };
      
      await api.put(`/games/${editingGame.id}`, gameData);
      setShowEditModal(false);
      setEditingGame(null);
      setFormData({
        title: '',
        genre_id: '',
        console_type: 'ps5',
        rating: '',
        max_players: '',
        estimated_duration: '',
        description: '',
        image_url: '',
        is_popular: false,
        is_new: false,
        release_date: ''
      });
      fetchGames();
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Error updating game. Please check the form.');
    }
  };

  const handleDelete = async (game) => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
      try {
        await api.delete(`/games/${game.id}`);
        fetchGames();
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('Error deleting game.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-gaming text-3xl font-bold text-white mt-6">Game Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Game</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-dark-card border border-neon-purple/20 rounded-lg overflow-hidden">
            {/* Game Image */}
            <div className="relative h-32 bg-gradient-to-br from-dark-card to-dark-hover">
              {game.image_url ? (
                <img 
                  src={game.image_url} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 ${game.image_url ? 'hidden' : 'flex'} items-center justify-center`}>
                <div className="text-3xl">🎮</div>
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button 
                  onClick={() => handleEdit(game)}
                  className="p-1 bg-black/50 hover:bg-neon-green/20 rounded"
                >
                  <Edit className="w-4 h-4 text-neon-green" />
                </button>
                <button 
                  onClick={() => handleDelete(game)}
                  className="p-1 bg-black/50 hover:bg-red-600/20 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            
            {/* Game Info */}
            <div className="p-4">
              <h3 className="font-bold text-white mb-2">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-1">{game.genre?.display_name || 'Unknown Genre'}</p>
              <p className="text-gray-400 text-sm mb-3">{game.console_type}</p>
              <div className="flex justify-between items-center">
                <span className="text-neon-purple font-bold">★ {game.rating}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  game.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {game.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* No Games */}
      {games.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-400">No games available</p>
        </div>
      )}

      {/* Add Game Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-neon-purple/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-gaming text-xl font-bold text-neon-purple">Add New Game</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <select
                    value={formData.genre_id}
                    onChange={(e) => setFormData({...formData, genre_id: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.display_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Console</label>
                  <select
                    value={formData.console_type}
                    onChange={(e) => setFormData({...formData, console_type: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  >
                    <option value="ps5">PS5</option>
                    <option value="ps4">PS4</option>
                    <option value="ps3">PS3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Players</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_players}
                    onChange={(e) => setFormData({...formData, max_players: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 15-20 hours"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({...formData, estimated_duration: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">Popular</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({...formData, is_new: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">New Release</span>
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
                >
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Game Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div key={editingGame?.id} className="bg-dark-card border border-neon-purple/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-gaming text-xl font-bold text-neon-purple">Edit Game</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <select
                    value={formData.genre_id}
                    onChange={(e) => setFormData({...formData, genre_id: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.display_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Console</label>
                  <select
                    value={formData.console_type}
                    onChange={(e) => setFormData({...formData, console_type: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  >
                    <option value="ps5">PS5</option>
                    <option value="ps4">PS4</option>
                    <option value="ps3">PS3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Players</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_players}
                    onChange={(e) => setFormData({...formData, max_players: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 15-20 hours"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({...formData, estimated_duration: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">Popular</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({...formData, is_new: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">New Release</span>
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
                >
                  Update Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames;