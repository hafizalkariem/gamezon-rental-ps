import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Users, 
  Calendar, 
  Trophy, 
  Star,
  ArrowRight,
  Gamepad2,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import { dashboardService } from '../services/api';
import { ApiResponse } from '../types';
import heroBg from '../assets/images/bg-1.jpg';
import ctaBg from '../assets/images/bg-4.jpg';

const Home = () => {
  const [stats, setStats] = useState([
    { label: 'Active Consoles', value: '0', icon: Gamepad2 },
    { label: 'Today Bookings', value: '0', icon: Calendar },
    { label: 'Active Members', value: '1,247', icon: Users },
    { label: 'Games Available', value: '0', icon: Play }
  ]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchStats();
    
    // Parallax scroll handler
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStats = async () => {
    try {
      const response: ApiResponse<any> = await dashboardService.getStats();
      const data = response.data;
      
      setStats([
        { label: 'Active Consoles', value: data.active_consoles.toString(), icon: Gamepad2 },
        { label: 'Today Bookings', value: data.today_bookings.toString(), icon: Calendar },
        { label: 'Active Members', value: '1,247', icon: Users },
        { label: 'Games Available', value: `${data.total_games}+`, icon: Play }
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Premium Equipment',
      description: 'Konsol PlayStation terbaru dengan kondisi prima dan maintenance rutin'
    },
    {
      icon: Zap,
      title: 'High-Speed Gaming',
      description: 'Koneksi internet super cepat untuk pengalaman online gaming terbaik'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Tim support siap membantu kapan saja untuk kenyamanan gaming Anda'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmad Rizki',
      rating: 5,
      comment: 'Setup gaming terbaik di Jakarta! PS5 nya selalu update game terbaru.',
      avatar: '🎮'
    },
    {
      name: 'Sarah Gaming',
      rating: 5,
      comment: 'Suasana gaming yang nyaman, staff ramah, dan harga terjangkau!',
      avatar: '🎯'
    },
    {
      name: 'Pro Gamer',
      rating: 5,
      comment: 'Perfect untuk latihan tournament. Fasilitas lengkap dan profesional.',
      avatar: '🏆'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        
        {/* Background Pattern with Parallax */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-20 left-10 w-64 h-64 bg-neon-blue rounded-full blur-3xl animate-float"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-float" 
            style={{ 
              animationDelay: '1s',
              transform: `translateY(${scrollY * -0.2}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-green rounded-full blur-3xl animate-float" 
            style={{ 
              animationDelay: '2s',
              transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)`
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="font-gaming text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-neon bg-clip-text text-transparent">
                  Gaming Zone
                </span>
                <br />
                <span className="text-white">Premium Experience</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Rasakan sensasi gaming terbaik dengan konsol PlayStation terbaru, 
                setup premium, dan atmosfer gaming yang tak terlupakan
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/booking"
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 flex items-center space-x-2 text-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/games"
                className="px-8 py-4 border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg font-bold rounded-lg transition-all duration-300 flex items-center space-x-2 text-lg"
              >
                <Play className="w-5 h-5" />
                <span>Explore Games</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-dark-card/50 backdrop-blur-sm border border-neon-blue/40 rounded-lg p-6 hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300">
                    <Icon className="w-8 h-8 text-neon-blue mx-auto mb-2 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {loading ? (
                        <div className="animate-pulse bg-gray-600 h-6 w-12 rounded mx-auto"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-gaming text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Fasilitas premium dan teknologi terdepan untuk pengalaman gaming yang tak terlupakan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-dark-card border border-neon-blue/20 rounded-lg p-8 hover:border-neon-blue/50 hover:bg-dark-hover transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-gaming text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-gaming text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                What Gamers Say
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Testimoni dari para gamer yang telah merasakan pengalaman premium di GameZone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-dark-card border border-neon-purple/20 rounded-lg p-6 hover:border-neon-purple/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ctaBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-gaming text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Ready to Game?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Jangan tunggu lagi! Book sekarang dan rasakan pengalaman gaming premium yang tak terlupakan.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 text-lg"
            >
              <Trophy className="w-5 h-5" />
              <span>Start Gaming Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;