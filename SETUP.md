# Setup Guide - GameZone Premium Rental

## 🚀 Panduan Setup Lengkap

### 1. Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Supabase CLI** - [Install Guide](https://supabase.com/docs/guides/cli)

### 2. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd playstation-rental-premium

# Install dependencies
npm install
```

### 3. Setup Database (Supabase)

#### Option A: Local Development (Recommended)

1. **Install Supabase CLI**
```bash
# Windows (PowerShell)
scoop install supabase

# macOS
brew install supabase/tap/supabase

# Linux
curl -fsSL https://supabase.com/install.sh | sh
```

2. **Start Supabase Local**
```bash
# Initialize Supabase
supabase init

# Start local services
supabase start
```

3. **Apply Database Migrations**
```bash
# Reset database dengan migrations
supabase db reset
```

4. **Get Local Credentials**
```bash
# Check status dan credentials
supabase status
```

#### Option B: Supabase Cloud

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Copy URL dan anon key dari Settings > API
3. Update file `.env` dengan credentials production

### 4. Environment Setup

1. **Copy environment file**
```bash
cp .env.example .env
```

2. **Update .env file**
```env
# Local Development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key

# Production (jika menggunakan Supabase Cloud)
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### 5. Start Development

```bash
# Start development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🗄️ Database Schema

Database sudah include sample data:

### Sample Data
- **5 Consoles**: PS3, PS4, PS5 dengan berbagai spesifikasi
- **8 Games**: Game populer seperti Spider-Man 2, FIFA 24, Call of Duty
- **6 Extras**: Headset, snacks, drinks, VR experience
- **8 Achievements**: System achievement untuk user engagement
- **4 Events**: Sample tournament dan party events
- **4 Promotions**: Discount dan bonus untuk user

### Key Features
- **Row Level Security (RLS)** enabled untuk semua tables
- **Real-time subscriptions** untuk live updates
- **Automatic triggers** untuk update user stats
- **Comprehensive indexing** untuk performance optimal

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Supabase (Local)
supabase start          # Start local services
supabase stop           # Stop local services
supabase status         # Check service status
supabase db reset       # Reset database
supabase db push        # Push schema changes
```

## 🌐 Supabase Services

Ketika menjalankan `supabase start`, services berikut akan tersedia:

- **API**: http://127.0.0.1:54321
- **DB**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Studio**: http://127.0.0.1:54323
- **Inbucket**: http://127.0.0.1:54324
- **Storage**: http://127.0.0.1:54321/storage/v1
- **Auth**: http://127.0.0.1:54321/auth/v1

## 🎮 Testing the Application

### 1. Frontend Testing
- Buka `http://localhost:5173`
- Navigate ke berbagai pages (Home, Booking, Games, Events, Blog)
- Test responsive design di berbagai screen sizes

### 2. Database Testing
- Buka Supabase Studio: `http://127.0.0.1:54323`
- Check tables dan sample data
- Test queries dan relationships

### 3. Authentication Testing
- Implement sign up/sign in functionality
- Test user sessions dan permissions
- Verify RLS policies

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

1. **Build aplikasi**
```bash
npm run build
```

2. **Deploy dengan environment variables**
```env
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
```

### Database (Supabase Cloud)

1. **Link local project ke cloud**
```bash
supabase link --project-ref your-project-ref
```

2. **Push migrations**
```bash
supabase db push
```

## 🔍 Troubleshooting

### Common Issues

1. **Supabase CLI Installation**
   - Windows: Use Scoop atau download binary
   - macOS: Use Homebrew
   - Linux: Use install script

2. **Port Conflicts**
   - Check ports 54321-54328 tidak digunakan aplikasi lain
   - Stop services lain yang menggunakan ports tersebut

3. **Database Connection**
   - Pastikan PostgreSQL tidak running di port 54322
   - Check firewall settings

4. **Environment Variables**
   - Pastikan file `.env` ada dan berisi credentials yang benar
   - Restart development server setelah update .env

### Getting Help

- **Documentation**: [Supabase Docs](https://supabase.com/docs)
- **Community**: [Supabase Discord](https://discord.supabase.com/)
- **Issues**: Create issue di repository ini

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase CLI installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Supabase local services running
- [ ] Database migrations applied
- [ ] Development server running
- [ ] All pages accessible
- [ ] Sample data loaded correctly

---

**Selamat! Setup GameZone Premium Rental sudah selesai!** 🎮✨

Untuk pertanyaan lebih lanjut, silakan buka issue atau hubungi tim development.