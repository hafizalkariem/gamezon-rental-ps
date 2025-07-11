import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Instagram,
  Youtube,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-bg border-t border-neon-blue/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-gaming text-xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                  GameZone
                </h3>
                <p className="text-sm text-gray-400 font-tech">Premium Rental</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rental PlayStation premium dengan fasilitas terlengkap dan teknologi terdepan. 
              Nikmati pengalaman gaming yang tak terlupakan!
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/hafizkariem?igsh=MXdoamdiOXFnejlqdA==" className="p-2 bg-dark-card hover:bg-neon-blue/20 rounded-lg transition-colors">
                <Instagram className="w-5 h-5 text-neon-blue" />
              </a>
              <a href="#" className="p-2 bg-dark-card hover:bg-neon-purple/20 rounded-lg transition-colors">
                <Youtube className="w-5 h-5 text-neon-purple" />
              </a>
              <a href="#" className="p-2 bg-dark-card hover:bg-neon-green/20 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5 text-neon-green" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-gaming text-lg font-bold text-neon-blue">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Booking Online', path: '/booking' },
                { label: 'Katalog Game', path: '/games' },
                { label: 'Event & Turnamen', path: '/events' },
                { label: 'Blog Gaming', path: '/blog' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-gaming text-lg font-bold text-neon-purple">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Rental PS3, PS4, PS5</li>
              <li>• VR Gaming Experience</li>
              <li>• Private Gaming Room</li>
              <li>• Tournament Hosting</li>
              <li>• Game Coaching</li>
              <li>• Birthday Party Package</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-gaming text-lg font-bold text-neon-green">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>Karangmekar, Kedungwaringin, Bekasi Regency, </p>
                  <p>Jawa Barat 17540</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-neon-green flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>+62 822-2622-1535</p>
                  <p>+62 895-1282-3282</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-neon-green flex-shrink-0" />
                <p className="text-sm text-gray-400">gamezone@gmail.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p><strong>Senin - Jumat:</strong> 14:00 - 24:00</p>
                  <p><strong>Sabtu - Minggu:</strong> 10:00 - 02:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 GameZone Premium Rental. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neon-blue transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-neon-blue transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;