export interface Console {
  id: number;
  name: string;
  type: 'ps3' | 'ps4' | 'ps5';
  hourly_rate: number;
  status: 'available' | 'occupied' | 'maintenance';
  specifications: {
    storage: string;
    controllers: number;
    features: string[];
  };
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: number;
  title: string;
  genre: string;
  console_type: 'ps3' | 'ps4' | 'ps5';
  rating: number;
  max_players: number;
  estimated_duration?: string;
  description?: string;
  image_url?: string;
  is_popular: boolean;
  is_new: boolean;
  release_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_type: 'tournament' | 'party' | 'workshop' | 'competition';
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants?: number;
  entry_fee: number;
  prize_pool?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  console_id: number;
  booking_date: string;
  start_time: string;
  duration_hours: number;
  end_time?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  console?: Console;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}