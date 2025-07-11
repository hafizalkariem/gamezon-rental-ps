# GameZone Premium Rental

Aplikasi rental PlayStation premium dengan fitur booking online, manajemen game, event & tournament, blog gaming, dan dashboard user.

## 🎮 Fitur Utama

- **Booking System**: Sistem booking online dengan pilihan konsol PS3, PS4, PS5
- **Game Library**: Katalog game lengkap dengan filter dan pencarian
- **Events & Tournaments**: Sistem event dan turnamen gaming
- **Blog Gaming**: Platform blog untuk review game dan tips gaming
- **User Dashboard**: Dashboard user dengan loyalty points dan achievement
- **Payment Integration**: Sistem pembayaran terintegrasi
- **Real-time Notifications**: Notifikasi real-time untuk booking dan event

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS dengan custom gaming theme
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase CLI (untuk development)

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd playstation-rental-premium
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Setup Supabase (Local Development)
```bash
# Install Supabase CLI
npm install -g supabase

# Start Supabase local development
supabase start

# Run database migrations
supabase db reset
```

5. Start development server
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Booking.tsx
│   ├── Games.tsx
│   ├── Events.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   └── Dashboard.tsx
├── lib/                # Utilities and configurations
│   └── supabase.ts     # Supabase client setup
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## 🗄️ Database Schema

### Core Tables

- **users**: User profiles dan authentication data
- **consoles**: PlayStation console types dan availability
- **games**: Game catalog dengan details
- **bookings**: Rental bookings dan sessions
- **extras**: Additional services (headset, snacks, etc.)
- **events**: Gaming events dan tournaments
- **blog_posts**: Blog articles dan content
- **loyalty_points**: User loyalty points system
- **achievements**: User achievements system

### Features

- Row Level Security (RLS) enabled
- Real-time subscriptions
- Automatic triggers untuk stats update
- Comprehensive indexing untuk performance

## 🎨 Design System

### Colors
- **Neon Blue**: `#00D4FF` - Primary actions
- **Neon Purple**: `#8B5CF6` - Secondary elements  
- **Neon Green**: `#00FF88` - Success states
- **Neon Pink**: `#FF00FF` - Accent colors
- **Dark Background**: `#0A0A0F` - Main background
- **Dark Card**: `#1A1A2E` - Card backgrounds

### Typography
- **Gaming Font**: Orbitron, Exo - Headers dan gaming elements
- **Tech Font**: Audiowide - Technical information

### Animations
- Glow effects untuk interactive elements
- Float animations untuk gaming icons
- Smooth transitions dengan Framer Motion

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Supabase Commands

```bash
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase status      # Check service status
supabase db reset    # Reset database dengan migrations
supabase db push     # Push schema changes
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build aplikasi
```bash
npm run build
```

2. Deploy ke platform pilihan dengan environment variables:
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Database (Supabase Cloud)

1. Create project di Supabase Dashboard
2. Run migrations:
```bash
supabase db push --linked
```

## 📱 Features Detail

### Booking System
- Real-time availability checking
- Multiple console types (PS3, PS4, PS5)
- Additional services (headset, snacks, VR)
- Payment integration
- Booking confirmation via WhatsApp

### Game Library
- 350+ games across all PlayStation generations
- Advanced filtering (genre, console, rating)
- Game details dengan screenshots
- Popularity dan new release tracking

### Events & Tournaments
- Tournament registration system
- Leaderboard tracking
- Prize pool management
- Event notifications

### User Dashboard
- Booking history
- Loyalty points tracking
- Achievement system
- Membership levels (Bronze, Silver, Gold, Platinum)

### Blog System
- Gaming news dan reviews
- User comments system
- Category filtering
- Social sharing features

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Untuk support dan pertanyaan:
- Email: info@gamezone.id
- WhatsApp: +62 812-3456-7890
- Website: https://gamezone.id

---

**GameZone Premium Rental** - Bringing the ultimate gaming experience to life! 🎮✨