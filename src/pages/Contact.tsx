import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Send,
  Instagram,
  Youtube,
  Headphones,
  Navigation
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Lokasi',
      details: [
        'Jl. Gaming Center No. 123',
        'Jakarta Selatan, 12345',
        'Dekat Mall Central Park'
      ],
      color: 'text-neon-blue'
    },
    {
      icon: Phone,
      title: 'Telepon',
      details: [
        '+62 812-3456-7890 (WhatsApp)',
        '+62 21-1234-5678 (Telepon)',
        'Available 24/7'
      ],
      color: 'text-neon-green'
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@gamezone.id',
        'booking@gamezone.id',
        'support@gamezone.id'
      ],
      color: 'text-neon-purple'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: [
        'Senin - Jumat: 14:00 - 24:00',
        'Sabtu - Minggu: 10:00 - 02:00',
        'Libur Nasional: 12:00 - 24:00'
      ],
      color: 'text-yellow-400'
    }
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: 'Instagram',
      handle: '@gamezone.id',
      url: '#',
      color: 'text-pink-400',
      followers: '15.2K'
    },
    {
      icon: Youtube,
      name: 'YouTube',
      handle: 'GameZone Premium',
      url: '#',
      color: 'text-red-400',
      followers: '8.5K'
    },
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      handle: '+62 812-3456-7890',
      url: '#',
      color: 'text-green-400',
      followers: 'Chat Now'
    }
  ];

  const faqs = [
    {
      question: 'Bagaimana cara melakukan booking?',
      answer: 'Anda dapat melakukan booking melalui website kami, WhatsApp, atau datang langsung ke lokasi. Pembayaran dapat dilakukan via transfer bank, e-wallet, atau cash.'
    },
    {
      question: 'Apakah bisa cancel booking?',
      answer: 'Ya, pembatalan dapat dilakukan maksimal 2 jam sebelum waktu booking. Refund akan diproses dalam 1-3 hari kerja.'
    },
    {
      question: 'Apakah ada paket khusus untuk group?',
      answer: 'Ya, kami menyediakan paket khusus untuk group mulai dari 4 orang dengan diskon menarik. Hubungi kami untuk informasi lebih lanjut.'
    },
    {
      question: 'Bagaimana sistem membership?',
      answer: 'Kami memiliki sistem loyalty points yang dapat ditukar dengan free gaming time, merchandise, dan benefit lainnya. Daftar gratis untuk mulai mengumpulkan poin.'
    }
  ];

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
              Contact Us
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get in touch with us for booking, support, or any questions about our gaming services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-gaming text-2xl font-bold text-white mb-6">
                Get in Touch
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 * index }}
                      className="bg-dark-card border border-gray-600 rounded-lg p-6 hover:border-neon-blue/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className={`font-bold ${info.color}`}>{info.title}</h3>
                      </div>
                      <div className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-400 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-dark-card border border-neon-purple/20 rounded-lg p-6"
            >
              <h3 className="font-gaming text-xl font-bold text-neon-purple mb-6">
                Follow Us
              </h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-dark-bg rounded-lg hover:bg-dark-hover transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-6 h-6 ${social.color}`} />
                        <div>
                          <p className="text-white font-medium">{social.name}</p>
                          <p className="text-gray-400 text-sm">{social.handle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${social.color}`}>
                          {social.followers}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-dark-card border border-neon-green/20 rounded-lg p-6"
            >
              <h3 className="font-gaming text-xl font-bold text-neon-green mb-4">
                Find Us
              </h3>
              <div className="bg-dark-bg rounded-lg p-8 text-center">
                <Navigation className="w-16 h-16 text-neon-green mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">GameZone Premium Rental</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Jl. Gaming Center No. 123, Jakarta Selatan
                </p>
                <button className="px-4 py-2 bg-neon-green text-dark-bg font-bold rounded-lg hover:bg-neon-green/80 transition-colors">
                  Open in Maps
                </button>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-dark-card border border-neon-blue/20 rounded-lg p-8"
            >
              <h2 className="font-gaming text-2xl font-bold text-neon-blue mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subjek *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white"
                      required
                    >
                      <option value="">Pilih Subjek</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="complaint">Complaint</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white resize-none"
                    placeholder="Tuliskan pesan Anda di sini..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:animate-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Kirim Pesan</span>
                </button>
              </form>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-dark-card border border-neon-green/20 rounded-lg p-8"
            >
              <h3 className="font-gaming text-xl font-bold text-neon-green mb-6 flex items-center">
                <Headphones className="w-6 h-6 mr-2" />
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                    className="bg-dark-bg rounded-lg p-4"
                  >
                    <h4 className="font-bold text-white mb-2">{faq.question}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-8 mt-12 text-center"
        >
          <h3 className="font-gaming text-2xl font-bold text-white mb-4">
            Need Immediate Help?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Untuk bantuan darurat atau pertanyaan mendesak, hubungi kami langsung melalui WhatsApp atau telepon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+6281234567890"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;