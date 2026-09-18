export interface Publication {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  images: string[];
  price: number;
  quantity: number;
  unit: string;
  main_category: string;
  sale_type: 'individual' | 'group';
  status: 'active' | 'expired' | 'sold' | 'cancelled';
  location?: string;
  views_count: number;
  created_at: string;
  expires_at?: string;
  updated_at: string;
}

export interface CreatePublicationInput {
  title: string;
  description?: string;
  images: string[];
  price: number;
  quantity: number;
  unit: string;
  main_category: string;
  sale_type?: 'individual' | 'group';
  location?: string;
}
