import { createClient } from '@/lib/supabase/client';
import type { Notification } from '../types';

/* ══════════════════════════════════════════════════════════
   NOTIFICATIONS SERVICE — Supabase direct
   ══════════════════════════════════════════════════════════ */

export const notificationService = {
  /* Liste + compteur non lues */
  async getByUser(userId: string, limit = 20): Promise<{
    notifications: Notification[];
    unreadCount: number;
  }> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getByUser notifications error:', error);
      return { notifications: [], unreadCount: 0 };
    }

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    return {
      notifications: (data || []) as Notification[],
      unreadCount: count || 0,
    };
  },

  /* Marquer une notification comme lue */
  async markAsRead(id: string): Promise<void> {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
  },

  /* Tout marquer comme lu */
  async markAllAsRead(userId: string): Promise<void> {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
  },

  /* Supprimer */
  async delete(id: string): Promise<void> {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
  },
};

/* ══════════════════════════════════════════════════════════
   CREATE — pour usage interne (propositions, groupes, etc.)
   ══════════════════════════════════════════════════════════ */

export async function createNotification(params: {
  user_id: string;
  type: string;
  title: string;
  content?: string;
  link?: string;
}): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('notifications').insert({
    user_id: params.user_id,
    type: params.type,
    title: params.title,
    content: params.content || null,
    link: params.link || null,
    read: false,
  });

  if (error) {
    console.error('createNotification error:', error);
    return false;
  }
  return true;
}
