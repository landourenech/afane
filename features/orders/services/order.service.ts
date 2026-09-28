import { createClient } from '@/lib/supabase/client';
import type { Order, CreateOrderInput, OrderStatus } from '../types';

export const orderService = {
  /* ══════════════════════════════════════════════════════════
     Commandes de l'acheteur
     ══════════════════════════════════════════════════════════ */
  async getByUser(userId: string): Promise<Order[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getByUser error:', error);
      throw error;
    }
    return (data || []) as Order[];
  },

  /* ══════════════════════════════════════════════════════════
     Ventes du vendeur
     ══════════════════════════════════════════════════════════ */
  async getSalesByUser(userId: string): Promise<Order[]> {
    const supabase = createClient();

    const { data: itemRows, error: itemsError } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('seller_id', userId);

    if (itemsError) {
      console.error('getSalesByUser items error:', itemsError);
      throw itemsError;
    }

    const orderIds = [...new Set((itemRows || []).map((r) => r.order_id))];
    if (orderIds.length === 0) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .in('id', orderIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getSalesByUser orders error:', error);
      throw error;
    }
    return (data || []) as Order[];
  },

  /* ══════════════════════════════════════════════════════════
     Détail commande
     ══════════════════════════════════════════════════════════ */
  async getById(id: string): Promise<Order | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Order | null;
  },

  /* ══════════════════════════════════════════════════════════
     Créer une commande — via RPC SECURITY DEFINER
     ══════════════════════════════════════════════════════════ */
  async create(input: CreateOrderInput, buyerId: string): Promise<Order> {
    const supabase = createClient();

    const orderNumber = `AF-${Date.now().toString(36).toUpperCase()}`;

    const { data: orderId, error } = await supabase.rpc(
      'create_order_with_items',
      {
        p_order_number: orderNumber,
        p_buyer_id: buyerId,
        p_subtotal: input.summary.subtotal,
        p_delivery_cost: input.summary.deliveryCost,
        p_service_fee: input.summary.serviceFee,
        p_discount: input.summary.discount,
        p_total: input.summary.total,
        p_delivery_option: input.delivery.option,
        p_delivery_address: input.delivery.address || null,
        p_delivery_city: input.delivery.city || null,
        p_delivery_region: input.delivery.region || null,
        p_delivery_phone: input.delivery.phone,
        p_delivery_notes: input.delivery.notes || null,
        p_payment_method: input.payment.method,
        p_items: input.items.map((item) => ({
          product_id: item.productId,
          seller_id: item.sellerId,
          title: item.title,
          image_url: item.image_url,
          price_per_unit: item.price_per_kg,
          unit: item.unit,
          quantity: item.quantity,
          line_total: item.price_per_kg * item.quantity,
        })),
      }
    );

    if (error) {
      console.error('RPC create_order error:', error);
      throw error;
    }

    /* Récupérer la commande complète */
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;
    return order as Order;
  },

  /* ══════════════════════════════════════════════════════════
     Annuler une commande
     ══════════════════════════════════════════════════════════ */
  async cancel(id: string, reason?: string): Promise<Order> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || "Annulée par l'acheteur",
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  /* ══════════════════════════════════════════════════════════
     Mettre à jour le statut
     ══════════════════════════════════════════════════════════ */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const supabase = createClient();

    const updates: any = { status };
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },
};
