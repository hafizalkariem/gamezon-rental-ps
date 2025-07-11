-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
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
  updated_at timestamptz DEFAULT now()
);

-- Consoles table
CREATE TABLE consoles (
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
CREATE TABLE games (
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

-- Extras table
CREATE TABLE extras (
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
CREATE TABLE bookings (
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
CREATE TABLE booking_extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  extra_id uuid NOT NULL REFERENCES extras(id),
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  unit_price integer NOT NULL,
  total_price integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, extra_id)
);

-- Events table
CREATE TABLE events (
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

-- Functions for computed columns
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

-- Triggers
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

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view consoles" ON consoles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view games" ON games
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view extras" ON extras
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Sample data
INSERT INTO consoles (name, type, hourly_rate, specifications) VALUES
('PlayStation 5 - Station 1', 'ps5', 35000, '{"storage": "825GB SSD", "controllers": 2, "features": ["4K Gaming", "Ray Tracing", "3D Audio"]}'),
('PlayStation 5 - Station 2', 'ps5', 35000, '{"storage": "825GB SSD", "controllers": 2, "features": ["4K Gaming", "Ray Tracing", "3D Audio"]}'),
('PlayStation 4 Pro - Station 1', 'ps4', 25000, '{"storage": "1TB HDD", "controllers": 2, "features": ["4K Gaming", "HDR"]}'),
('PlayStation 4 Pro - Station 2', 'ps4', 25000, '{"storage": "1TB HDD", "controllers": 2, "features": ["4K Gaming", "HDR"]}'),
('PlayStation 3 - Station 1', 'ps3', 15000, '{"storage": "500GB HDD", "controllers": 2, "features": ["Blu-ray", "Backwards Compatible"]}');

INSERT INTO extras (name, description, price, category) VALUES
('Gaming Headset', 'Premium gaming headset with noise cancellation', 5000, 'accessory'),
('Snack Package', 'Chips, cookies, and candy combo', 15000, 'food'),
('Drinks Package', 'Soft drinks and energy drinks', 10000, 'drink'),
('VR Experience', 'PlayStation VR gaming session', 20000, 'service'),
('Extra Controller', 'Additional wireless controller', 8000, 'accessory'),
('Gaming Chair Upgrade', 'Premium gaming chair for comfort', 12000, 'service');

INSERT INTO games (title, genre, console_type, rating, max_players, estimated_duration, description, is_popular, is_new) VALUES
('Spider-Man 2', 'action', 'ps5', 4.9, 2, '15-20h', 'Swing through New York as Spider-Man and Miles Morales in this epic superhero adventure.', true, true),
('FIFA 24', 'sports', 'ps5', 4.7, 4, '90min', 'The most realistic football simulation with updated teams and enhanced gameplay.', true, false),
('Call of Duty: MW III', 'shooter', 'ps5', 4.8, 4, '8-12h', 'Intense military warfare with stunning graphics and immersive multiplayer modes.', true, true),
('Gran Turismo 7', 'racing', 'ps5', 4.6, 2, '10-15h', 'The ultimate racing simulator with realistic physics and stunning car models.', false, false),
('God of War Ragnarök', 'action', 'ps5', 4.9, 1, '20-25h', 'Epic Norse mythology adventure with Kratos and Atreus facing Ragnarök.', true, false),
('Tekken 8', 'fighting', 'ps5', 4.8, 2, '5-10h', 'The latest installment in the legendary fighting game series.', false, true),
('Elden Ring', 'rpg', 'ps5', 4.9, 4, '50-80h', 'Open-world fantasy RPG from the creators of Dark Souls.', true, false),
('Horizon Forbidden West', 'adventure', 'ps5', 4.7, 1, '25-30h', 'Explore a post-apocalyptic world filled with robotic creatures.', false, false);

INSERT INTO events (title, description, event_type, event_date, start_time, end_time, max_participants, entry_fee, prize_pool, is_featured) VALUES
('FIFA 24 Championship', 'Turnamen FIFA 24 terbesar dengan hadiah jutaan rupiah. Daftar sekarang!', 'tournament', '2024-02-15', '18:00', '23:00', 32, 50000, 'Rp 2,000,000', true),
('PS5 Launch Party', 'Rayakan peluncuran game terbaru dengan sesi gaming gratis dan hadiah menarik.', 'party', '2024-02-20', '19:00', '23:00', 50, 0, 'Free Gaming', false),
('Call of Duty Battle Royale', 'Pertarungan epik dalam mode Battle Royale terbaru Call of Duty.', 'tournament', '2024-02-25', '20:00', '24:00', 64, 75000, 'Rp 1,500,000', false),
('Retro Gaming Night', 'Nostalgia dengan game-game klasik PlayStation generasi lama.', 'party', '2024-03-01', '18:30', '22:30', 30, 25000, 'Merchandise', false);