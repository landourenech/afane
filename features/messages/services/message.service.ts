import { createClient } from '@/lib/supabase/client';
import type { Conversation, Message } from '../types';

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function detectQueryType(query: string): 'email' | 'phone' | 'text' {
  const trimmed = query.trim();
  if (trimmed.includes('@')) return 'email';
  if (/^[\d\s+\-()]+$/.test(trimmed) && trimmed.replace(/\D/g, '').length >= 3) {
    return 'phone';
  }
  return 'text';
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// ═══════════════════════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════════════════════

export const messageService = {
  /**
   * Récupérer toutes les conversations de l'utilisateur
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_1_profile:profiles!conversations_participant_1_fkey(id, display_name, username, avatar_url),
        participant_2_profile:profiles!conversations_participant_2_fkey(id, display_name, username, avatar_url)
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

  /**
   * Récupérer les messages d'une conversation
   */
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

  /**
   * Envoyer un message
   */
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

  /**
   * Marquer les messages comme lus
   */
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
// RECHERCHE UTILISATEURS MULTI-CHAMPS
// ═══════════════════════════════════════════════════════════

/**
 * Rechercher des utilisateurs par nom, username, email ou téléphone
 */
export async function searchUsers(
  query: string,
  currentUserId: string,
  limit: number = 20
) {
  const supabase = createClient();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const queryType = detectQueryType(trimmed);

  let queryBuilder = supabase
    .from('profiles')
    .select('id, display_name, username, avatar_url, role, phone, email')
    .neq('id', currentUserId)
    .limit(limit);

  if (queryType === 'email') {
    queryBuilder = queryBuilder.ilike('email', `%${trimmed}%`);
  } else if (queryType === 'phone') {
    const normalized = normalizePhone(trimmed);
    queryBuilder = queryBuilder.or(
      `phone.ilike.%${trimmed}%,phone.ilike.%${normalized}%`
    );
  } else {
    queryBuilder = queryBuilder.or(
      `display_name.ilike.%${trimmed}%,` +
      `username.ilike.%${trimmed}%,` +
      `email.ilike.%${trimmed}%`
    );
  }

  const { data, error } = await queryBuilder;
  if (error) {
    console.error('Erreur recherche utilisateurs:', error);
    return [];
  }
  return data || [];
}

/**
 * Récupérer ou créer une conversation avec un utilisateur
 */
export async function getOrCreateConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  const supabase = createClient();
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
