import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Monitor, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api';

const AdminConsoles = () => {
  const [consoles, setConsoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConsole, setEditingConsole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    station: 'Station 1',
    type: 'ps5',
    hourly_rate: '',
    status: 'available',
    specifications: {
      storage: '',
      controllers: '',
      features: []
    },
    image_url: ''
  });
  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    fetchConsoles();
  }, []);

  const fetchConsoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consoles');
      setConsoles(response.data || []);
    } catch (error) {
      console.error('Error fetching consoles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const consoleData = {
        ...formData,
        hourly_rate: parseInt(formData.hourly_rate),
        specifications: {
          ...formData.specifications,
          features: featuresInput.split(',').map(f => f.trim()).filter(f => f)
        },
        is_active: true
      };
      
      await api.post('/consoles', consoleData);
      setShowModal(false);
      resetForm();
      fetchConsoles();
    } catch (error) {
      console.error('Error creating console:', error);
      alert('Error creating console.');
    }
  };

  const handleEdit = (console) => {
    setEditingConsole(console);
    const specs = console.specifications || { storage: '', controllers: '', features: [] };
    setFormData({
      name: console.name || '',
      station: console.station || 'Station 1',
      type: console.type || 'ps5',
      hourly_rate: console.hourly_rate ? String(console.hourly_rate) : '',
      status: console.status || 'available',
      specifications: specs,
      image_url: console.image_url || ''
    });
    setFeaturesInput(Array.isArray(specs.features) ? specs.features.join(', ') : '');
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const consoleData = {
        ...formData,
        hourly_rate: parseInt(formData.hourly_rate),
        specifications: {
          ...formData.specifications,
          features: featuresInput.split(',').map(f => f.trim()).filter(f => f)
        }
      };
      
      await api.put(`/consoles/${editingConsole.id}`, consoleData);
      setShowEditModal(false);
      setEditingConsole(null);
      resetForm();
      fetchConsoles();
    } catch (error) {
      console.error('Error updating console:', error);
      alert('Error updating console.');
    }
  };

  const handleDelete = async (console) => {
    if (window.confirm(`Are you sure you want to delete "${console.name}"?`)) {
      try {
        await api.delete(`/consoles/${console.id}`);
        fetchConsoles();
      } catch (error) {
        console.error('Error deleting console:', error);
        alert('Error deleting console.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      station: 'Station 1',
      type: 'ps5',
      hourly_rate: '',
      status: 'available',
      specifications: {
        storage: '',
        controllers: '',
        features: []
      },
      image_url: ''
    });
    setFeaturesInput('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'occupied':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-600/20 text-green-400';
      case 'occupied':
        return 'bg-red-600/20 text-red-400';
      case 'maintenance':
        return 'bg-yellow-600/20 text-yellow-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getConsoleTypeColor = (type) => {
    switch (type) {
      case 'ps5':
        return 'neon-blue';
      case 'ps4':
        return 'neon-purple';
      case 'ps3':
        return 'neon-green';
      default:
        return 'neon-blue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-gaming text-3xl font-bold text-white mt-6">Console Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Console</span>
        </button>
      </div>

      {/* Console Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-card border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 font-bold text-2xl">
                {consoles.filter(c => c.status === 'available').length}
              </p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-dark-card border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 font-bold text-2xl">
                {consoles.filter(c => c.status === 'occupied').length}
              </p>
              <p className="text-gray-400 text-sm">Occupied</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-dark-card border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 font-bold text-2xl">
                {consoles.filter(c => c.status === 'maintenance').length}
              </p>
              <p className="text-gray-400 text-sm">Maintenance</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-dark-card border border-neon-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neon-blue font-bold text-2xl">{consoles.length}</p>
              <p className="text-gray-400 text-sm">Total Consoles</p>
            </div>
            <Monitor className="w-8 h-8 text-neon-blue" />
          </div>
        </div>
      </div>

      {/* Console Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consoles.map((console) => {
          const typeColor = getConsoleTypeColor(console.type);
          return (
            <div key={console.id} className={`bg-dark-card border border-${typeColor}/20 rounded-lg overflow-hidden`}>
              {/* Console Header */}
              <div className={`bg-${typeColor}/10 p-4 border-b border-${typeColor}/20`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Monitor className={`w-6 h-6 text-${typeColor}`} />
                    <span className={`text-${typeColor} font-bold text-lg`}>
                      {console.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(console.status)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(console.status)}`}>
                      {console.status}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-white">{console.name}</h3>
                <p className="text-gray-400 text-sm">{console.station}</p>
              </div>
              
              {/* Console Details */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hourly Rate:</span>
                    <span className={`text-${typeColor} font-bold`}>
                      Rp {console.hourly_rate?.toLocaleString()}
                    </span>
                  </div>
                  
                  {console.specifications?.storage && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="text-white">{console.specifications.storage}</span>
                    </div>
                  )}
                  
                  {console.specifications?.controllers && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Controllers:</span>
                      <span className="text-white">{console.specifications.controllers}</span>
                    </div>
                  )}
                </div>
                
                {/* Features */}
                {console.specifications?.features && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {console.specifications.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 bg-${typeColor}/20 text-${typeColor} rounded text-xs`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(console)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-neon-green/20 hover:bg-neon-green/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-neon-green" />
                    <span className="text-neon-green text-sm">Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(console)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* No Consoles */}
      {consoles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No consoles available</p>
          <p className="text-gray-500">Add your first console to get started</p>
        </div>
      )}

      {/* Add Console Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-neon-purple/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-gaming text-xl font-bold text-neon-purple">Add New Console</h2>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  >
                    <option value="ps5">PS5</option>
                    <option value="ps4">PS4</option>
                    <option value="ps3">PS3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Storage</label>
                  <input
                    type="text"
                    placeholder="e.g., 1TB SSD"
                    value={formData.specifications.storage}
                    onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, storage: e.target.value}})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Controllers</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 DualSense"
                    value={formData.specifications.controllers}
                    onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, controllers: e.target.value}})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                <input
                  type="text"
                  placeholder="e.g., 4K Gaming, Ray Tracing, HDR (separate with commas)"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                />
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
                  Add Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Console Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div key={editingConsole?.id} className="bg-dark-card border border-neon-purple/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-gaming text-xl font-bold text-neon-purple">Edit Console</h2>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  >
                    <option value="ps5">PS5</option>
                    <option value="ps4">PS4</option>
                    <option value="ps3">PS3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Storage</label>
                  <input
                    type="text"
                    placeholder="e.g., 1TB SSD"
                    value={formData.specifications.storage}
                    onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, storage: e.target.value}})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Controllers</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 DualSense"
                    value={formData.specifications.controllers}
                    onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, controllers: e.target.value}})}
                    className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                <input
                  type="text"
                  placeholder="e.g., 4K Gaming, Ray Tracing, HDR (separate with commas)"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white"
                />
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
                  Update Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsoles;