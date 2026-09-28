import { createClient } from '@/lib/supabase/client';

/* ══════════════════════════════════════════════════════════
   GROUP SALE SERVICE
   ══════════════════════════════════════════════════════════ */

export interface GroupParticipant {
  id: string;
  user_id: string;
  quantity: number;
  joined_at: string;
  user?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export interface GroupProgress {
  publication_id: string;
  title: string;
  min_group_quantity: number;
  group_price: number;
  base_price: number;
  participants_count: number;
  total_quantity: number;
  is_complete: boolean;
}

export const groupSaleService = {
  async getProgress(publicationId: string): Promise<GroupProgress | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('group_sale_progress')
      .select('*')
      .eq('publication_id', publicationId)
      .maybeSingle();

    if (error) {
      console.error('getProgress error:', error);
      return null;
    }
    return data as GroupProgress | null;
  },

  async getParticipants(publicationId: string): Promise<GroupParticipant[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('group_participants')
      .select(`
        id,
        user_id,
        quantity,
        joined_at,
        user:profiles!group_participants_user_id_fkey(
          display_name,
          username,
          avatar_url
        )
      `)
      .eq('publication_id', publicationId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('getParticipants error:', error);
      return [];
    }

    /* ✅ Normaliser : Supabase renvoie parfois un tableau */
    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      quantity: row.quantity,
      joined_at: row.joined_at,
      user: Array.isArray(row.user) ? row.user[0] || null : row.user || null,
    }));
  },

  async join(publicationId: string, userId: string, quantity = 1): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('group_participants')
      .insert({ publication_id: publicationId, user_id: userId, quantity });

    if (error) {
      console.error('join error:', error);
      return false;
    }
    return true;
  },

  async leave(publicationId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('group_participants')
      .delete()
      .eq('publication_id', publicationId)
      .eq('user_id', userId);

    if (error) {
      console.error('leave error:', error);
      return false;
    }
    return true;
  },

  async updateQuantity(publicationId: string, userId: string, quantity: number): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('group_participants')
      .update({ quantity })
      .eq('publication_id', publicationId)
      .eq('user_id', userId);

    return !error;
  },

  async isParticipant(publicationId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    const { data } = await supabase
      .from('group_participants')
      .select('id')
      .eq('publication_id', publicationId)
      .eq('user_id', userId)
      .maybeSingle();

    return !!data;
  },
};
