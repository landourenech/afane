import { createClient } from '@/lib/supabase/client';

export interface ConversationMember {
  id: string;
  user_id: string;
  role: 'member' | 'admin' | 'seller';
  joined_at: string;
  user?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export interface GroupConversation {
  id: string;
  publication_id: string | null;
  name: string | null;
  avatar_url: string | null;
  type: string;
  members: ConversationMember[];
}

export const groupChatService = {
  /* Créer/récupérer le chat d'une vente groupée */
  async getOrCreate(publicationId: string): Promise<string | null> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_or_create_group_chat', {
      p_publication_id: publicationId,
    });

    if (error) {
      console.error('getOrCreate group chat error:', error);
      return null;
    }
    return data as string;
  },

  /* Membres d'une conversation */
  async getMembers(conversationId: string): Promise<ConversationMember[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('conversation_members')
      .select(`
        id,
        user_id,
        role,
        joined_at,
        user:profiles!conversation_members_user_id_fkey(
          display_name, username, avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('getMembers error:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      user: Array.isArray(row.user) ? row.user[0] : row.user,
    }));
  },

  /* Détails de la conversation (nom, avatar) */
  async getConversation(conversationId: string): Promise<GroupConversation | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle();

    if (error) return null;
    return data as GroupConversation | null;
  },
};

/* ══════════════════════════════════════════════════════════
   UPDATE NAME
   ══════════════════════════════════════════════════════════ */

export async function updateGroupName(
  conversationId: string,
  newName: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('conversations')
    .update({ name: newName.trim(), updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) {
    console.error('updateGroupName error:', error);
    return false;
  }
  return true;
}

/* ══════════════════════════════════════════════════════════
   COOPERATIVE CHAT
   ══════════════════════════════════════════════════════════ */

export async function getOrCreateCooperativeChat(
  cooperativeId: string
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_or_create_cooperative_chat', {
    p_cooperative_id: cooperativeId,
  });

  if (error) {
    console.error('getOrCreateCooperativeChat error:', error);
    return null;
  }
  return data as string;
}
