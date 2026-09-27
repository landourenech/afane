'use client';

import { Search, MessageCircle, SquarePen } from 'lucide-react';
import type { Conversation } from '../types';
import { isUserOnline } from '../hooks/use-presence';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onNewConversation: () => void;
  currentUserId: string;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayMs = 86400000;

  if (diff < dayMs) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (diff < dayMs * 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function previewMessage(content: string | undefined): string {
  if (!content) return '';
  const cleaned = content.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 40) + '...';
}

export function ConversationList({
  conversations,
  loading,
  selectedId,
  onSelect,
  onNewConversation,
  currentUserId,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] border-r border-[var(--border-primary)]">
      {/* ═════ Header ═════ */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Messages
          </h1>
          <button
            onClick={onNewConversation}
            className="p-2 rounded-full bg-[var(--afane-orange)] text-[var(--text-inverse)] hover:bg-[var(--afane-orange-hover)] active:scale-95 transition-all"
            aria-label="Nouveau message"
          >
            <SquarePen className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-tertiary)] rounded-full text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
          />
        </div>
      </div>

      {/* ═════ Liste ═════ */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                  <div className="h-3 bg-[var(--bg-tertiary)] rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-full mb-3">
              <MessageCircle className="h-8 w-8 text-[var(--text-tertiary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              Aucune conversation
            </p>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Commencez à discuter avec quelqu'un
            </p>
            <button
              onClick={onNewConversation}
              className="px-4 py-2 bg-[var(--afane-orange)] text-[var(--text-inverse)] text-sm font-semibold rounded-full hover:bg-[var(--afane-orange-hover)] active:scale-95 transition-all"
            >
              Nouveau message
            </button>
          </div>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.other_user;
            const isSelected = conv.id === selectedId;
            const lastMsg = conv.last_message;
            const isOwnLastMsg = lastMsg?.sender_id === currentUserId;
            const online = isUserOnline(otherUser?.last_seen_at);
            const hasMessages = !!lastMsg;

            // Nom : display_name sinon @username sinon "Utilisateur"
            const displayName =
              otherUser?.display_name ||
              (otherUser?.username ? `@${otherUser.username}` : null) ||
              'Utilisateur';

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-[var(--border-primary)] ${
                  isSelected
                    ? 'bg-[var(--afane-orange)]/10 border-l-4 border-l-[var(--afane-orange)]'
                    : 'hover:bg-[var(--bg-hover)] active:bg-[var(--bg-tertiary)]'
                }`}
              >
                {/* Avatar + Point en ligne */}
                <div className="relative flex-shrink-0">
                  {otherUser?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={otherUser.avatar_url}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[var(--afane-green)] rounded-full flex items-center justify-center text-[var(--text-inverse)] font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Point de présence */}
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-primary)] transition-colors ${
                      online ? 'bg-green-500' : 'bg-[var(--text-tertiary)]'
                    }`}
                    title={online ? 'En ligne' : 'Hors ligne'}
                  />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  {/* Ligne 1 : Nom + Statut en ligne/hors ligne */}
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                        {displayName}
                      </p>
                      {/* Statut en ligne / hors ligne */}
                      <span
                        className={`text-[10px] font-medium flex items-center gap-1 flex-shrink-0 ${
                          online
                            ? 'text-green-600'
                            : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            online ? 'bg-green-500' : 'bg-[var(--text-tertiary)]'
                          }`}
                        />
                        {online ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                  </div>

                  {/* Ligne 2 : Aperçu + Heure + Badge non lus */}
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate ${
                        (conv.unread_count || 0) > 0
                          ? 'text-[var(--text-primary)] font-semibold'
                          : hasMessages
                          ? 'text-[var(--text-secondary)]'
                          : 'text-[var(--afane-orange)] italic font-medium'
                      }`}
                    >
                      {!hasMessages ? (
                        'Nouvelle conversation'
                      ) : (
                        <>
                          {isOwnLastMsg && (
                            <span className="text-[var(--text-tertiary)]">
                              Vous :{' '}
                            </span>
                          )}
                          {previewMessage(lastMsg.content)}
                        </>
                      )}
                    </p>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {hasMessages && lastMsg && (
                        <span className="text-[10px] text-[var(--text-tertiary)]">
                          {formatTime(lastMsg.created_at)}
                        </span>
                      )}
                      {(conv.unread_count || 0) > 0 && (
                        <span className="min-w-5 h-5 px-1.5 bg-[var(--afane-orange)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unread_count! > 99 ? '99+' : conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
