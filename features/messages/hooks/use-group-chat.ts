'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  groupChatService,
  type ConversationMember,
} from '../services/group-chat.service';

export function useGroupChat(publicationId: string | undefined) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!publicationId) return;
    setLoading(true);

    const convId = await groupChatService.getOrCreate(publicationId);
    setConversationId(convId);

    if (convId) {
      const list = await groupChatService.getMembers(convId);
      setMembers(list);
    }
    setLoading(false);
  }, [publicationId]);

  useEffect(() => {
    load();

    /* Realtime sur les nouveaux membres */
    if (!conversationId) return;
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();

    const channel = supabase
      .channel(`group-chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_members',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, load]);

  return { conversationId, members, loading, refresh: load };
}
