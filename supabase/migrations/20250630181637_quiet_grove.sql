/*
  # Complete Database Schema for PlayStation Premium Rental

  1. New Tables
    - `users` - User profiles and authentication data
    - `consoles` - PlayStation console types and availability
    - `games` - Game catalog with details
    - `bookings` - Rental bookings and sessions
    - `booking_extras` - Additional services for bookings
    - `extras` - Available additional services
    - `payments` - Payment transactions
    - `loyalty_points` - User loyalty points system
    - `events` - Gaming events and tournaments
    - `event_participants` - Event registration data
    - `blog_posts` - Blog articles and content
    - `blog_comments` - Comments on blog posts
    - `reviews` - User reviews and ratings
    - `notifications` - System notifications
    - `support_tickets` - Customer support tickets
    - `achievements` - User achievements system
    - `leaderboard` - Tournament leaderboard data

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Implement role-based access control

  3. Indexes and Constraints
    - Add performance indexes
    - Foreign key constraints
    - Check constraints for data validation
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  date_of_birth date,
  membership_level text DEFAULT 'bronze' CHECK (membership_level IN ('bronze', 'silver', 'gold', 'platinum')),
  total_bookings integer DEFAULT 0,
  total_hours integer DEFAULT 0,
  loyalty_points integer DEFAULT 0,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_users_auth FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Consoles table
CREATE TABLE IF NOT EXISTS consoles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('ps3', 'ps4', 'ps5')),
  hourly_rate integer NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  specifications jsonb,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  genre text NOT NULL,
  console_type text NOT NULL CHECK (console_type IN ('ps3', 'ps4', 'ps5')),
  rating decimal(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  max_players integer DEFAULT 1,
  estimated_duration text,
  description text,
  image_url text,
  is_popular boolean DEFAULT false,
  is_new boolean DEFAULT false,
  release_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Extras table (additional services)
CREATE TABLE IF NOT EXISTS extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  category text DEFAULT 'accessory' CHECK (category IN ('accessory', 'food', 'drink', 'service')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  console_id uuid NOT NULL REFERENCES consoles(id),
  booking_date date NOT NULL,
  start_time time NOT NULL,
  duration_hours integer NOT NULL CHECK (duration_hours > 0),
  end_time time,
  total_amount integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(console_id, booking_date, start_time)
);

-- Booking extras junction table
CREATE TABLE IF NOT EXISTS booking_extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  extra_id uuid NOT NULL REFERENCES extras(id),
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  unit_price integer NOT NULL,
  total_price integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, extra_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'transfer', 'qris', 'ewallet', 'credit_card')),
  payment_gateway text,
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Loyalty points table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  type text NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired')),
  source text NOT NULL CHECK (source IN ('booking', 'referral', 'event', 'birthday', 'redemption')),
  description text,
  booking_id uuid REFERENCES bookings(id),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('tournament', 'party', 'workshop', 'competition')),
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  max_participants integer,
  entry_fee integer DEFAULT 0,
  prize_pool text,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  image_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'completed')),
  rank integer,
  score integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES users(id),
  category text NOT NULL CHECK (category IN ('game-reviews', 'gaming-tips', 'tournaments', 'news', 'guides')),
  image_url text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  read_time text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES blog_comments(id),
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, booking_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('booking', 'payment', 'event', 'promotion', 'system')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);



-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  points_required integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tournament_points integer DEFAULT 0,
  tournaments_won integer DEFAULT 0,
  tournaments_participated integer DEFAULT 0,
  current_rank integer,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_hours')),
  discount_value integer NOT NULL,
  min_booking_hours integer DEFAULT 1,
  valid_from date NOT NULL,
  valid_until date NOT NULL,
  max_uses integer,
  current_uses integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_console_id ON bookings(console_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_games_console_type ON games(console_type);
CREATE INDEX IF NOT EXISTS idx_games_genre ON games(genre);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view basic user info" ON users
  FOR SELECT USING (true);

-- Consoles policies (public read)
CREATE POLICY "Anyone can view consoles" ON consoles
  FOR SELECT USING (is_active = true);

-- Games policies (public read)
CREATE POLICY "Anyone can view games" ON games
  FOR SELECT USING (is_active = true);

-- Extras policies (public read)
CREATE POLICY "Anyone can view extras" ON extras
  FOR SELECT USING (is_active = true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Events policies (public read)
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Blog posts policies (public read)
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (is_active = true);

-- Leaderboard policies (public read)
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Promotions policies (public read)
CREATE POLICY "Anyone can view active promotions" ON promotions
  FOR SELECT USING (is_active = true AND valid_from <= CURRENT_DATE AND valid_until >= CURRENT_DATE);

-- Functions to calculate computed columns
CREATE OR REPLACE FUNCTION calculate_end_time(start_time time, duration_hours integer)
RETURNS time AS $$
BEGIN
  RETURN (start_time + (duration_hours || ' hours')::interval)::time;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION calculate_total_price(quantity integer, unit_price integer)
RETURNS integer AS $$
BEGIN
  RETURN quantity * unit_price;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Triggers to update computed columns
CREATE OR REPLACE FUNCTION update_booking_end_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_time = calculate_end_time(NEW.start_time, NEW.duration_hours);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_end_time
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_end_time();

CREATE OR REPLACE FUNCTION update_booking_extra_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_price = calculate_total_price(NEW.quantity, NEW.unit_price);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_extra_total
  BEFORE INSERT OR UPDATE ON booking_extras
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_extra_total();

-- Insert sample data

-- Sample consoles
INSERT INTO consoles (name, type, hourly_rate, specifications) VALUES
('PlayStation 5 - Station 1', 'ps5', 35000, '{"storage": "825GB SSD", "controllers": 2, "features": ["4K Gaming", "Ray Tracing", "3D Audio"]}'),
('PlayStation 5 - Station 2', 'ps5', 35000, '{"storage": "825GB SSD", "controllers": 2, "features": ["4K Gaming", "Ray Tracing", "3D Audio"]}'),
('PlayStation 4 Pro - Station 1', 'ps4', 25000, '{"storage": "1TB HDD", "controllers": 2, "features": ["4K Gaming", "HDR"]}'),
('PlayStation 4 Pro - Station 2', 'ps4', 25000, '{"storage": "1TB HDD", "controllers": 2, "features": ["4K Gaming", "HDR"]}'),
('PlayStation 3 - Station 1', 'ps3', 15000, '{"storage": "500GB HDD", "controllers": 2, "features": ["Blu-ray", "Backwards Compatible"]}');

-- Sample extras
INSERT INTO extras (name, description, price, category) VALUES
('Gaming Headset', 'Premium gaming headset with noise cancellation', 5000, 'accessory'),
('Snack Package', 'Chips, cookies, and candy combo', 15000, 'food'),
('Drinks Package', 'Soft drinks and energy drinks', 10000, 'drink'),
('VR Experience', 'PlayStation VR gaming session', 20000, 'service'),
('Extra Controller', 'Additional wireless controller', 8000, 'accessory'),
('Gaming Chair Upgrade', 'Premium gaming chair for comfort', 12000, 'service');

-- Sample games
INSERT INTO games (title, genre, console_type, rating, max_players, estimated_duration, description, is_popular, is_new) VALUES
('Spider-Man 2', 'action', 'ps5', 4.9, 2, '15-20h', 'Swing through New York as Spider-Man and Miles Morales in this epic superhero adventure.', true, true),
('FIFA 24', 'sports', 'ps5', 4.7, 4, '90min', 'The most realistic football simulation with updated teams and enhanced gameplay.', true, false),
('Call of Duty: MW III', 'shooter', 'ps5', 4.8, 4, '8-12h', 'Intense military warfare with stunning graphics and immersive multiplayer modes.', true, true),
('Gran Turismo 7', 'racing', 'ps5', 4.6, 2, '10-15h', 'The ultimate racing simulator with realistic physics and stunning car models.', false, false),
('God of War Ragnarök', 'action', 'ps5', 4.9, 1, '20-25h', 'Epic Norse mythology adventure with Kratos and Atreus facing Ragnarök.', true, false),
('Tekken 8', 'fighting', 'ps5', 4.8, 2, '5-10h', 'The latest installment in the legendary fighting game series.', false, true),
('Elden Ring', 'rpg', 'ps5', 4.9, 4, '50-80h', 'Open-world fantasy RPG from the creators of Dark Souls.', true, false),
('Horizon Forbidden West', 'adventure', 'ps5', 4.7, 1, '25-30h', 'Explore a post-apocalyptic world filled with robotic creatures.', false, false);

-- Sample achievements
INSERT INTO achievements (name, description, points_required) VALUES
('First Timer', 'Complete your first gaming session', 0),
('Night Owl', 'Game after 10 PM', 100),
('Marathon Gamer', 'Play for 6+ hours in one session', 500),
('Social Gamer', 'Play with 3+ friends', 200),
('Loyalty Master', 'Reach 5000 loyalty points', 5000),
('Tournament Champion', 'Win your first tournament', 1000),
('Game Explorer', 'Try 10 different games', 300),
('Weekend Warrior', 'Book 5 weekend sessions', 400);

-- Sample events
INSERT INTO events (title, description, event_type, event_date, start_time, end_time, max_participants, entry_fee, prize_pool, is_featured) VALUES
('FIFA 24 Championship', 'Turnamen FIFA 24 terbesar dengan hadiah jutaan rupiah. Daftar sekarang!', 'tournament', '2024-02-15', '18:00', '23:00', 32, 50000, 'Rp 2,000,000', true),
('PS5 Launch Party', 'Rayakan peluncuran game terbaru dengan sesi gaming gratis dan hadiah menarik.', 'party', '2024-02-20', '19:00', '23:00', 50, 0, 'Free Gaming', false),
('Call of Duty Battle Royale', 'Pertarungan epik dalam mode Battle Royale terbaru Call of Duty.', 'tournament', '2024-02-25', '20:00', '24:00', 64, 75000, 'Rp 1,500,000', false),
('Retro Gaming Night', 'Nostalgia dengan game-game klasik PlayStation generasi lama.', 'party', '2024-03-01', '18:30', '22:30', 30, 25000, 'Merchandise', false);

-- Sample promotions
INSERT INTO promotions (title, description, discount_type, discount_value, min_booking_hours, valid_from, valid_until, max_uses) VALUES
('Weekend Special', 'Diskon 20% untuk booking weekend', 'percentage', 20, 2, '2024-01-01', '2024-12-31', 1000),
('New Member Bonus', 'Gratis 1 jam untuk member baru', 'free_hours', 1, 1, '2024-01-01', '2024-12-31', 500),
('Marathon Gaming', 'Diskon Rp 50,000 untuk booking 6+ jam', 'fixed_amount', 50000, 6, '2024-01-01', '2024-12-31', 200),
('Student Discount', 'Diskon 15% untuk pelajar/mahasiswa', 'percentage', 15, 1, '2024-01-01', '2024-12-31', 2000);d uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  category text NOT NULL CHECK (category IN ('booking', 'technical', 'billing', 'general')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  points_required integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tournament_points integer DEFAULT 0,
  tournaments_won integer DEFAULT 0,
  tournaments_participated integer DEFAULT 0,
  current_rank integer,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_hours')),
  discount_value integer NOT NULL,
  min_booking_hours integer DEFAULT 1,
  valid_from date NOT NULL,
  valid_until date NOT NULL,
  max_uses integer,
  current_uses integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_console_id ON bookings(console_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_games_console_type ON games(console_type);
CREATE INDEX IF NOT EXISTS idx_games_genre ON games(genre);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view basic user info" ON users
  FOR SELECT USING (true);

-- Consoles policies (public read)
CREATE POLICY "Anyone can view consoles" ON consoles
  FOR SELECT USING (is_active = true);

-- Games policies (public read)
CREATE POLICY "Anyone can view games" ON games
  FOR SELECT USING (is_active = true);

-- Extras policies (public read)
CREATE POLICY "Anyone can view extras" ON extras
  FOR SELECT USING (is_active = true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Events policies (public read)
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Blog posts policies (public read)
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (is_active = true);

-- Leaderboard policies (public read)
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Promotions policies (public read)
CREATE POLICY "Anyone can view active promotions" ON promotions
  FOR SELECT USING (is_active = true AND valid_from <= CURRENT_DATE AND valid_until >= CURRENT_DATE);

-- Insert sample data

-- Sample consoles
INSERT INTO consoles (name, type, hourly_rate, specifications) VALUES
('PlayStation 5 - Station 1', 'ps5', 35000, '{"storage": "825GB SSD", "controllers": 2, "features": ["4K Gaming", "Ray Tracing", "3D Audio"]}'),
('PlayStation 5 - Station 2', 'ps5', 35000, '{"storage": "825GB SSD", "controllers": 2, "features": ["4K Gaming", "Ray Tracing", "3D Audio"]}'),
('PlayStation 4 Pro - Station 1', 'ps4', 25000, '{"storage": "1TB HDD", "controllers": 2, "features": ["4K Gaming", "HDR"]}'),
('PlayStation 4 Pro - Station 2', 'ps4', 25000, '{"storage": "1TB HDD", "controllers": 2, "features": ["4K Gaming", "HDR"]}'),
('PlayStation 3 - Station 1', 'ps3', 15000, '{"storage": "500GB HDD", "controllers": 2, "features": ["Blu-ray", "Backwards Compatible"]}');

-- Sample extras
INSERT INTO extras (name, description, price, category) VALUES
('Gaming Headset', 'Premium gaming headset with noise cancellation', 5000, 'accessory'),
('Snack Package', 'Chips, cookies, and candy combo', 15000, 'food'),
('Drinks Package', 'Soft drinks and energy drinks', 10000, 'drink'),
('VR Experience', 'PlayStation VR gaming session', 20000, 'service'),
('Extra Controller', 'Additional wireless controller', 8000, 'accessory'),
('Gaming Chair Upgrade', 'Premium gaming chair for comfort', 12000, 'service');

-- Sample games
INSERT INTO games (title, genre, console_type, rating, max_players, estimated_duration, description, is_popular, is_new) VALUES
('Spider-Man 2', 'action', 'ps5', 4.9, 2, '15-20h', 'Swing through New York as Spider-Man and Miles Morales in this epic superhero adventure.', true, true),
('FIFA 24', 'sports', 'ps5', 4.7, 4, '90min', 'The most realistic football simulation with updated teams and enhanced gameplay.', true, false),
('Call of Duty: MW III', 'shooter', 'ps5', 4.8, 4, '8-12h', 'Intense military warfare with stunning graphics and immersive multiplayer modes.', true, true),
('Gran Turismo 7', 'racing', 'ps5', 4.6, 2, '10-15h', 'The ultimate racing simulator with realistic physics and stunning car models.', false, false),
('God of War Ragnarök', 'action', 'ps5', 4.9, 1, '20-25h', 'Epic Norse mythology adventure with Kratos and Atreus facing Ragnarök.', true, false),
('Tekken 8', 'fighting', 'ps5', 4.8, 2, '5-10h', 'The latest installment in the legendary fighting game series.', false, true),
('Elden Ring', 'rpg', 'ps5', 4.9, 4, '50-80h', 'Open-world fantasy RPG from the creators of Dark Souls.', true, false),
('Horizon Forbidden West', 'adventure', 'ps5', 4.7, 1, '25-30h', 'Explore a post-apocalyptic world filled with robotic creatures.', false, false);

-- Sample achievements
INSERT INTO achievements (name, description, points_required) VALUES
('First Timer', 'Complete your first gaming session', 0),
('Night Owl', 'Game after 10 PM', 100),
('Marathon Gamer', 'Play for 6+ hours in one session', 500),
('Social Gamer', 'Play with 3+ friends', 200),
('Loyalty Master', 'Reach 5000 loyalty points', 5000),
('Tournament Champion', 'Win your first tournament', 1000),
('Game Explorer', 'Try 10 different games', 300),
('Weekend Warrior', 'Book 5 weekend sessions', 400);

-- Sample events
INSERT INTO events (title, description, event_type, event_date, start_time, end_time, max_participants, entry_fee, prize_pool, is_featured) VALUES
('FIFA 24 Championship', 'Turnamen FIFA 24 terbesar dengan hadiah jutaan rupiah. Daftar sekarang!', 'tournament', '2024-02-15', '18:00', '23:00', 32, 50000, 'Rp 2,000,000', true),
('PS5 Launch Party', 'Rayakan peluncuran game terbaru dengan sesi gaming gratis dan hadiah menarik.', 'party', '2024-02-20', '19:00', '23:00', 50, 0, 'Free Gaming', false),
('Call of Duty Battle Royale', 'Pertarungan epik dalam mode Battle Royale terbaru Call of Duty.', 'tournament', '2024-02-25', '20:00', '24:00', 64, 75000, 'Rp 1,500,000', false),
('Retro Gaming Night', 'Nostalgia dengan game-game klasik PlayStation generasi lama.', 'party', '2024-03-01', '18:30', '22:30', 30, 25000, 'Merchandise', false);

-- Sample promotions
INSERT INTO promotions (title, description, discount_type, discount_value, min_booking_hours, valid_from, valid_until, max_uses) VALUES
('Weekend Special', 'Diskon 20% untuk booking weekend', 'percentage', 20, 2, '2024-01-01', '2024-12-31', 1000),
('New Member Bonus', 'Gratis 1 jam untuk member baru', 'free_hours', 1, 1, '2024-01-01', '2024-12-31', 500),
('Marathon Gaming', 'Diskon Rp 50,000 untuk booking 6+ jam', 'fixed_amount', 50000, 6, '2024-01-01', '2024-12-31', 200),
('Student Discount', 'Diskon 15% untuk pelajar/mahasiswa', 'percentage', 15, 1, '2024-01-01', '2024-12-31', 2000);