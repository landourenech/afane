'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Users, Crown, Loader2, Wheat } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupChat } from '../hooks/use-group-chat';

interface GroupChatPanelProps {
  publicationId?: string;
  cooperativeId?: string;
  publicationTitle: string;   /* garde le nom pour compat, sert de titre par défaut */
  onClose: () => void;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function GroupChatPanel({
  publicationId,
  cooperativeId,
  publicationTitle,
  onClose,
}: GroupChatPanelProps) {
  const { profile } = useAuth();
  const { conversationId, members, loading: membersLoading } = useGroupChat({
    publicationId,
    cooperativeId,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCoop = !!cooperativeId;

  useEffect(() => {
    if (!conversationId) return;
    const supabase = createClient();

    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(display_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100);

      setMessages((data || []).map((m: any) => ({
        ...m,
        sender: Array.isArray(m.sender) ? m.sender[0] : m.sender,
      })));
    };

    load();

    const channel = supabase
      .channel(`group-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          const { data: senderData } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .maybeSingle();

          setMessages((prev) => [...prev, { ...newMsg, sender: senderData }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !profile?.id) return;

    setSending(true);
    const supabase = createClient();
    const content = input.trim();
    setInput('');

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: profile.id,
      content,
    });

    setSending(false);
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:max-w-2xl md:rounded-2xl bg-[var(--bg-primary)] rounded-t-3xl md:rounded-b-2xl shadow-2xl flex flex-col h-[85vh] md:h-[80vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className={`p-2 rounded-xl ${isCoop ? 'bg-[var(--afane-green)]/10' : 'bg-[var(--afane-orange)]/10'}`}>
            {isCoop ? (
              <Wheat className="h-5 w-5 text-[var(--afane-green)]" />
            ) : (
              <Users className="h-5 w-5 text-[var(--afane-orange)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm text-[var(--text-primary)] truncate">
              {publicationTitle}
            </h2>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              {isCoop ? 'Coopérative' : 'Groupe'} · {members.length} membre{members.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            title="Voir les membres"
          >
            <Users className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)]"
          >
            <X className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Membres drawer */}
        {showMembers && (
          <div className="border-b border-[var(--border-primary)] p-3 bg-[var(--bg-tertiary)] max-h-48 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
              Membres
            </p>
            <div className="space-y-1.5">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  {m.user?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.user.avatar_url}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-white text-[10px] font-bold">
                      {(m.user?.display_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-[var(--text-primary)] flex-1 truncate">
                    {m.user?.display_name || 'Utilisateur'}
                    {m.user_id === profile?.id && ' (vous)'}
                  </span>
                  {(m.role === 'seller' || m.role === 'admin') && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)]">
          {membersLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 text-[var(--afane-orange)] animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-[var(--text-secondary)]">
                Aucun message pour le moment
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Soyez le premier à écrire !
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === profile?.id;
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isMe && (
                    m.sender?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.sender.avatar_url}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {(m.sender?.display_name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )
                  )}
                  <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isMe && (
                      <p className="text-[10px] text-[var(--text-tertiary)] mb-0.5 px-2">
                        {m.sender?.display_name || 'Utilisateur'}
                      </p>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl ${
                        isMe
                          ? 'bg-[var(--afane-green)] text-white rounded-tr-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                    </div>
                    <p className="text-[9px] text-[var(--text-tertiary)] mt-0.5 px-2">
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border-primary)] p-3 bg-[var(--bg-primary)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Écrire un message..."
              className="flex-1 px-4 py-2.5 bg-[var(--bg-tertiary)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="p-2.5 rounded-full bg-[var(--afane-green)] text-white hover:bg-[var(--afane-orange)] active:scale-95 transition-all disabled:opacity-40"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
