import { createClient } from '@/lib/supabase/client';
import { rateLimit } from '@/lib/rate-limit';
import type { Conversation, Message } from '../types';

// ═══════════════════════════════════════════════════════════
// SERVICE — MESSAGERIE (SÉCURISÉ)
// ═══════════════════════════════════════════════════════════

export const messageService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_1_profile:profiles!conversations_participant_1_fkey(id, display_name, username, avatar_url, last_seen_at),
        participant_2_profile:profiles!conversations_participant_2_fkey(id, display_name, username, avatar_url, last_seen_at)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    const conversations: Conversation[] = await Promise.all(
      (data || []).map(async (conv: any) => {
        const isUser1 = conv.participant_1 === userId;
        const otherProfile = isUser1
          ? conv.participant_2_profile
          : conv.participant_1_profile;

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, sender_id, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('read', false)
          .neq('sender_id', userId);

        return {
          ...conv,
          other_user: otherProfile,
          last_message: lastMsg || undefined,
          unread_count: unreadCount || 0,
        };
      })
    );

    return conversations;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<Message> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const supabase = createClient();
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);
  },
};

// ═══════════════════════════════════════════════════════════
// RECHERCHE UTILISATEURS — SÉCURISÉE
// ═══════════════════════════════════════════════════════════

/**
 * Rechercher des utilisateurs (par nom ou @username UNIQUEMENT)
 * - ✅ Pas d'email ni phone en retour
 * - ✅ Admins masqués
 * - ✅ Auth obligatoire
 * - ✅ Rate limiting
 * - ✅ Min 2 caractères
 */
export async function searchUsers(
  query: string,
  currentUserId: string,
  limit: number = 20
) {
  const supabase = createClient();

  const trimmed = query.trim();

  // ✅ Minimum 2 caractères
  if (!trimmed || trimmed.length < 2) return [];

  // ✅ Rate limiting (30 recherches / minute / user)
  const { allowed } = rateLimit(`search:${currentUserId}`, {
    maxAttempts: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    console.warn('Rate limit atteint pour:', currentUserId);
    return [];
  }

  // ✅ Appel RPC sécurisé (filtrage côté DB)
  const { data, error } = await supabase.rpc('search_users_secure', {
    search_query: trimmed,
    exclude_user_id: currentUserId,
    max_results: limit,
  });

  if (error) {
    console.error('Erreur recherche:', error);
    return [];
  }

  return data || [];
}

// ═══════════════════════════════════════════════════════════
// CONVERSATION — CRÉATION
// ═══════════════════════════════════════════════════════════

export async function getOrCreateConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  const supabase = createClient();

  // ✅ Interdire de créer une conversation avec soi-même
  if (currentUserId === otherUserId) {
    throw new Error('Impossible de créer une conversation avec soi-même');
  }

  const [p1, p2] = [currentUserId, otherUserId].sort();

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1', p1)
    .eq('participant_2', p2)
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ participant_1: p1, participant_2: p2 })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}
