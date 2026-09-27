'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, Info, MessageCircle } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { isUserOnline } from '../hooks/use-presence';
import type { Conversation, Message } from '../types';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  currentUserId: string;
  onSend: (content: string) => Promise<void> | void;
  onBack?: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  loading,
  currentUserId,
  onSend,
  onBack,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-[var(--bg-secondary)] text-center p-6">
        <div className="p-6 bg-[var(--bg-primary)] rounded-full mb-4 shadow-sm">
          <MessageCircle className="h-12 w-12 text-[var(--afane-orange)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
          Vos messages
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xs">
          Sélectionnez une conversation pour commencer à discuter
        </p>
      </div>
    );
  }

  const otherUser = conversation.other_user;
  const online = isUserOnline(otherUser?.last_seen_at);

  // Affiche le nom, sinon le @username, sinon "Utilisateur"
  const displayName =
    otherUser?.display_name ||
    (otherUser?.username ? `@${otherUser.username}` : null) ||
    'Utilisateur';

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* ═════ Header — VERT AFANE + texte blanc ═════ */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[var(--afane-green)] text-[var(--text-inverse)] flex-shrink-0">
        {/* Bouton retour (mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 -ml-1 rounded-full hover:bg-white/10 md:hidden transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--text-inverse)]" />
          </button>
        )}

        {/* Avatar + Nom + Statut */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {otherUser?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={otherUser.avatar_url}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/30"
            />
          ) : (
            <div className="w-10 h-10 bg-[var(--afane-orange)] rounded-full flex items-center justify-center text-[var(--text-inverse)] font-semibold flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            {/* Nom (ou @username si pas de nom) */}
            <p className="font-semibold text-sm text-[var(--text-inverse)] truncate">
              {displayName}
            </p>
            {/* Statut en ligne / hors ligne — en blanc */}
            <p className="text-xs text-[var(--text-inverse)]/80 truncate flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  online ? 'bg-green-400' : 'bg-white/40'
                }`}
              />
              {online ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-2 rounded-full hover:bg-white/10 text-[var(--text-inverse)] transition-colors"
            aria-label="Appel audio"
          >
            <Phone className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-white/10 text-[var(--text-inverse)] transition-colors"
            aria-label="Appel vidéo"
          >
            <Video className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-white/10 text-[var(--text-inverse)] transition-colors hidden md:inline-flex"
            aria-label="Informations"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ═════ Messages ═════ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--border-primary)] border-t-[var(--afane-orange)]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Aucun message. Dites bonjour 👋
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender_id === currentUserId;
            const prevMsg = messages[idx - 1];
            const showAvatar =
              !prevMsg || prevMsg.sender_id !== msg.sender_id;

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={isOwn}
                showAvatar={showAvatar}
                senderPhoto={otherUser?.avatar_url}
                senderName={displayName}
              />
            );
          })
        )}
      </div>

      {/* ═════ Input ═════ */}
      <MessageInput onSend={onSend} />
    </div>
  );
}
