
/* ═══════════════════════════════════════════════════════════
   AFANE 2.0 — Types Database
   Types Supabase (générés)
   ═══════════════════════════════════════════════════════════ */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          firebase_uid: string;
          email: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          bio: string | null;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | null;
          country: string;
          region: string | null;
          department: string | null;
          city: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          role: 'user' | 'producer' | 'cooperative' | 'buyer' | 'supplier' | 'advisor' | 'admin';
          onboarding_completed: boolean;
          verification_status: 'pending' | 'verified' | 'rejected';
          farm_name: string | null;
          farm_size: number | null;
          main_crops: string[] | null;
          farming_experience: number | null;
          cooperative_name: string | null;
          number_of_members: number | null;
          cooperative_registration: string | null;
          company_name: string | null;
          business_type: string | null;
          purchase_capacity: string | null;
          supplier_company: string | null;
          product_categories: string[] | null;
          supplier_license: string | null;
          specialization: string | null;
          certifications: string[] | null;
          years_of_experience: number | null;
          preferred_language: string;
          notification_preferences: {
            email: boolean;
            push: boolean;
            sms: boolean;
          };
          created_at: string;
          updated_at: string;
          onboarding_completed_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          firebase_uid: string;
          email: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };

      publications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          images: string[];
          price: number;
          quantity: number;
          unit: string;
          main_category: string;
          sub_category: string | null;
          tags: string[];
          sale_type: 'individual' | 'group';
          condition: 'new' | 'used' | 'refurbished';
          min_group_quantity: number | null;
          max_group_quantity: number | null;
          group_price: number | null;
          bulk_discount: number;
          min_order_quantity: number;
          max_order_quantity: number | null;
          location: string | null;
          status: 'active' | 'sold' | 'expired' | 'cancelled';
          views_count: number;
          duration_days: number;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['publications']['Row']> & {
          user_id: string;
          title: string;
          price: number;
        };
        Update: Partial<Database['public']['Tables']['publications']['Row']>;
      };

      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          publication_id: string | null;
          quantity: number;
          unit_price: number;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'refunded';
          notes: string | null;
          delivery_address: string | null;
          delivery_date: string | null;
          created_at: string;
          updated_at: string;
          confirmed_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['orders']['Row']> & {
          buyer_id: string;
          seller_id: string;
          quantity: number;
          total_amount: number;
        };
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          content: string | null;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & {
          user_id: string;
          type: string;
          title: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}