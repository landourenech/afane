import { createClient } from '@/lib/supabase/client';
import type { Order, CreateOrderInput, OrderStatus } from '../types';

export const orderService = {
  /* ══════════════════════════════════════════════════════════
     Récupérer les commandes d'un utilisateur (Supabase direct)
     ══════════════════════════════════════════════════════════ */
  async getByUser(userId: string): Promise<Order[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  },

  /* ══════════════════════════════════════════════════════════
     Récupérer les ventes d'un vendeur
     ══════════════════════════════════════════════════════════ */
  async getSalesByUser(userId: string): Promise<Order[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items!inner(*)
      `)
      .eq('order_items.seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  },

  /* ══════════════════════════════════════════════════════════
     Récupérer une commande par ID
     ══════════════════════════════════════════════════════════ */
  async getById(id: string): Promise<Order | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Order | null;
  },

  /* ══════════════════════════════════════════════════════════
     Créer une commande (via API pour la sécurité)
     ══════════════════════════════════════════════════════════ */
  async create(input: CreateOrderInput): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur création commande');
    }

    const { order } = await res.json();
    return order;
  },

  /* ══════════════════════════════════════════════════════════
     Annuler une commande
     ══════════════════════════════════════════════════════════ */
  async cancel(id: string, reason?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', reason }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur annulation');
    }

    const { order } = await res.json();
    return order;
  },

  /* ══════════════════════════════════════════════════════════
     Mettre à jour le statut (vendeur)
     ══════════════════════════════════════════════════════════ */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', status }),
    });

    if (!res.ok) throw new Error('Erreur mise à jour');
    const { order } = await res.json();
    return order;
  },
};
