import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          date_of_birth: string | null;
          membership_level: 'bronze' | 'silver' | 'gold' | 'platinum';
          total_bookings: number;
          total_hours: number;
          loyalty_points: number;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          date_of_birth?: string | null;
          membership_level?: 'bronze' | 'silver' | 'gold' | 'platinum';
          total_bookings?: number;
          total_hours?: number;
          loyalty_points?: number;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          date_of_birth?: string | null;
          membership_level?: 'bronze' | 'silver' | 'gold' | 'platinum';
          total_bookings?: number;
          total_hours?: number;
          loyalty_points?: number;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      consoles: {
        Row: {
          id: string;
          name: string;
          type: 'ps3' | 'ps4' | 'ps5';
          hourly_rate: number;
          status: 'available' | 'occupied' | 'maintenance';
          specifications: any;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      games: {
        Row: {
          id: string;
          title: string;
          genre: string;
          console_type: 'ps3' | 'ps4' | 'ps5';
          rating: number;
          max_players: number;
          estimated_duration: string | null;
          description: string | null;
          image_url: string | null;
          is_popular: boolean;
          is_new: boolean;
          release_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          console_id: string;
          booking_date: string;
          start_time: string;
          duration_hours: number;
          end_time: string;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'refunded';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      extras: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category: 'accessory' | 'food' | 'drink' | 'service';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_type: 'tournament' | 'party' | 'workshop' | 'competition';
          event_date: string;
          start_time: string;
          end_time: string;
          max_participants: number | null;
          entry_fee: number;
          prize_pool: string | null;
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
          image_url: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};