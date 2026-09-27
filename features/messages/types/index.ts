// ═══════════════════════════════════════════════════════════
// AFANE 2.0 — Types Messages
// ═══════════════════════════════════════════════════════════

export interface ConversationUser {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  last_seen_at: string | null;
}

export interface LastMessage {
  content: string;
  sender_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  other_user?: ConversationUser;
  last_message?: LastMessage;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}
