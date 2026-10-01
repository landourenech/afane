'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  groupChatService,
  getOrCreateCooperativeChat,
  type ConversationMember,
} from '../services/group-chat.service';

interface UseGroupChatOptions {
  publicationId?: string;
  cooperativeId?: string;
}

export function useGroupChat(options: UseGroupChatOptions | string | undefined) {
  /* Support ancien appel useGroupChat(publicationId) ET nouveau useGroupChat({...}) */
  const opts: UseGroupChatOptions =
    typeof options === 'string' || options === undefined
      ? { publicationId: options as string | undefined }
      : options;

  const { publicationId, cooperativeId } = opts;

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!publicationId && !cooperativeId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    let convId: string | null = null;
    if (cooperativeId) {
      convId = await getOrCreateCooperativeChat(cooperativeId);
    } else if (publicationId) {
      convId = await groupChatService.getOrCreate(publicationId);
    }

    setConversationId(convId);

    if (convId) {
      const list = await groupChatService.getMembers(convId);
      setMembers(list);
    }
    setLoading(false);
  }, [publicationId, cooperativeId]);

  useEffect(() => {
    load();

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
