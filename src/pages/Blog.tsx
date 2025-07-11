import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  User, 
  Heart, 
  MessageCircle, 
  Share2,
  TrendingUp,
  Clock,
  Tag,
  ArrowRight
} from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all', 'game-reviews', 'gaming-tips', 'tournaments', 'news', 'guides'
  ];

  const featuredPost = {
    id: 1,
    title: 'Ultimate Guide to Mastering FIFA 24: Tips from Pro Players',
    excerpt: 'Learn the secrets of professional FIFA players with our comprehensive guide covering advanced techniques, formations, and strategies that will elevate your game to the next level.',
    content: 'FIFA 24 has revolutionized the football gaming experience with its enhanced mechanics and realistic gameplay...',
    author: 'GameMaster Pro',
    date: '2024-01-20',
    readTime: '8 min read',
    category: 'gaming-tips',
    image: '⚽',
    likes: 124,
    comments: 18,
    shares: 32,
    trending: true
  };

  const blogPosts = [
    {
      id: 2,
      title: 'Spider-Man 2 Review: Web-Slinging Perfection',
      excerpt: 'Our in-depth review of the latest Spider-Man game covering gameplay, graphics, story, and everything you need to know.',
      author: 'ReviewMaster',
      date: '2024-01-18',
      readTime: '6 min read',
      category: 'game-reviews',
      image: '🕷️',
      likes: 89,
      comments: 12,
      shares: 24,
      trending: false
    },
    {
      id: 3,
      title: '5 Essential Gaming Accessories for PS5',
      excerpt: 'Discover the must-have accessories that will enhance your PlayStation 5 gaming experience.',
      author: 'GearGuru',
      date: '2024-01-15',
      readTime: '4 min read',
      category: 'guides',
      image: '🎮',
      likes: 67,
      comments: 8,
      shares: 15,
      trending: true
    },
    {
      id: 4,
      title: 'Call of Duty Tournament Results & Highlights',
      excerpt: 'Recap of the latest Call of Duty tournament with highlights, winners, and memorable moments.',
      author: 'TournamentReporter',
      date: '2024-01-12',
      readTime: '5 min read',
      category: 'tournaments',
      image: '🎯',
      likes: 156,
      comments: 23,
      shares: 41,
      trending: false
    },
    {
      id: 5,
      title: 'PlayStation 5 Stock Update & Availability',
      excerpt: 'Latest news on PS5 availability, restocks, and where to find the console.',
      author: 'NewsReporter',
      date: '2024-01-10',
      readTime: '3 min read',
      category: 'news',
      image: '📰',
      likes: 78,
      comments: 15,
      shares: 28,
      trending: false
    },
    {
      id: 6,
      title: 'How to Build the Perfect Gaming Setup',
      excerpt: 'Step-by-step guide to creating an optimal gaming environment for maximum performance and comfort.',
      author: 'SetupExpert',
      date: '2024-01-08',
      readTime: '7 min read',
      category: 'guides',
      image: '🖥️',
      likes: 92,
      comments: 19,
      shares: 36,
      trending: true
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'game-reviews': 'text-neon-blue',
      'gaming-tips': 'text-neon-green',
      'tournaments': 'text-neon-purple',
      'news': 'text-yellow-400',
      'guides': 'text-neon-pink'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };

  const getCategoryBg = (category: string) => {
    const colors = {
      'game-reviews': 'bg-neon-blue/20 border-neon-blue/30',
      'gaming-tips': 'bg-neon-green/20 border-neon-green/30',
      'tournaments': 'bg-neon-purple/20 border-neon-purple/30',
      'news': 'bg-yellow-400/20 border-yellow-400/30',
      'guides': 'bg-neon-pink/20 border-neon-pink/30'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600/20 border-gray-600/30';
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
              Gaming Blog
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest gaming news, reviews, tips, and community insights
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-dark-card to-dark-hover border border-neon-blue/20 rounded-lg p-8 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className="px-3 py-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-bold rounded-full">
              FEATURED
            </span>
            {featuredPost.trending && (
              <span className="px-3 py-1 bg-neon-green text-dark-bg text-sm font-bold rounded-full flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>TRENDING</span>
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBg(featuredPost.category)} ${getCategoryColor(featuredPost.category)}`}>
                  {featuredPost.category.replace('-', ' ').toUpperCase()}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </span>
                </div>
              </div>
              
              <h2 className="font-gaming text-3xl font-bold text-white mb-4">
                {featuredPost.title}
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{featuredPost.author}</p>
                    <p className="text-gray-400 text-sm">Gaming Expert</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{featuredPost.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{featuredPost.comments}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4" />
                    <span>{featuredPost.shares}</span>
                  </span>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 flex items-center space-x-2">
                <span>Read Full Article</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-9xl mb-4 animate-float">{featuredPost.image}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Featured Article</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-dark-card border border-neon-blue/20 rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
              >
                <option value="all">All Categories</option>
                <option value="game-reviews">Game Reviews</option>
                <option value="gaming-tips">Gaming Tips</option>
                <option value="tournaments">Tournaments</option>
                <option value="news">News</option>
                <option value="guides">Guides</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-dark-card border border-gray-600 hover:border-neon-blue/50 rounded-lg overflow-hidden group transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{post.image}</div>
                  <div className="flex flex-col space-y-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getCategoryBg(post.category)} ${getCategoryColor(post.category)}`}>
                      {post.category.replace('-', ' ').toUpperCase()}
                    </span>
                    {post.trending && (
                      <span className="px-2 py-1 bg-neon-green text-dark-bg text-xs font-bold rounded flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>HOT</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Post Content */}
                <h3 className="font-gaming text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-neon-blue transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Post Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1 hover:text-neon-blue transition-colors cursor-pointer">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </span>
                    <span className="flex items-center space-x-1 hover:text-neon-green transition-colors cursor-pointer">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </span>
                  </div>
                </div>
                
                {/* Read More Button */}
                <button className="w-full py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/20 rounded-lg p-8 mt-12 text-center"
        >
          <h3 className="font-gaming text-2xl font-bold text-white mb-4">
            Stay Updated with Gaming News
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest gaming news, reviews, and tips delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-purple focus:ring-1 focus:ring-neon-purple text-white"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-lg hover:animate-glow transition-all duration-300">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;