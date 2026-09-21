import { createClient } from '@/lib/supabase/client';
import type { Order, CreateOrderInput } from '../types';

export const orderService = {
  async getByUser(userId: string): Promise<Order[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },

  async create(input: CreateOrderInput, buyerId: string): Promise<Order> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...input, buyer_id: buyerId })
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },
};
