'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { messageService } from '../services/message.service';
import type { Message } from '../types';

export function useMessages(
  conversationId: string | null,
  currentUserId: string | undefined
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const data = await messageService.getMessages(conversationId);
      setMessages(data);

      // Marquer comme lus
      if (currentUserId) {
        await messageService.markAsRead(conversationId, currentUserId);
      }
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime
  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const send = async (content: string) => {
    if (!conversationId || !currentUserId || !content.trim()) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: content.trim(),
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const real = await messageService.sendMessage(
        conversationId,
        currentUserId,
        content
      );
      // Remplacer le temp par le vrai
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? real : m))
      );
    } catch (err) {
      // Rollback
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.error('Erreur envoi:', err);
    }
  };

  return { messages, loading, send };
}
