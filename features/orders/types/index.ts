export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  publication_id?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  delivery_address?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  seller_id: string;
  publication_id?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  notes?: string;
  delivery_address?: string;
}
