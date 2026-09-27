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

/**
 * Tronque un message pour l'aperçu
 */
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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* ═════ Header ═════ */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={onNewConversation}
            className="p-2 rounded-full bg-gradient-to-br from-[#e86c00] to-[#d16000] text-white hover:shadow-lg active:scale-95 transition-all"
            aria-label="Nouveau message"
          >
            <SquarePen className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#e86c00]/30"
          />
        </div>
      </div>

      {/* ═════ Liste ═════ */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="p-4 bg-gray-100 rounded-full mb-3">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Aucune conversation
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Commencez à discuter avec quelqu'un
            </p>
            <button
              onClick={onNewConversation}
              className="px-4 py-2 bg-gradient-to-br from-[#e86c00] to-[#d16000] text-white text-sm font-semibold rounded-full hover:shadow-lg active:scale-95 transition-all"
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

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 ${
                  isSelected
                    ? 'bg-[#e86c00]/5 border-l-4 border-l-[#e86c00]'
                    : 'hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                {/* ═════ Avatar + Point en ligne ═════ */}
                <div className="relative flex-shrink-0">
                  {otherUser?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={otherUser.avatar_url}
                      alt={otherUser.display_name || ''}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0c4428] to-[#e86c00] rounded-full flex items-center justify-center text-white font-semibold">
                      {(otherUser?.display_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Point de présence */}
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors ${
                      online ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={online ? 'En ligne' : 'Hors ligne'}
                  />
                </div>

                {/* ═════ Contenu ═════ */}
                <div className="flex-1 min-w-0">
                  {/* Ligne 1 : Nom + Heure */}
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {otherUser?.display_name || 'Utilisateur'}
                    </p>
                    {hasMessages && lastMsg && (
                      <span className="text-[11px] text-gray-400 flex-shrink-0">
                        {formatTime(lastMsg.created_at)}
                      </span>
                    )}
                  </div>

                  {/* Ligne 2 : Aperçu message OU "Nouvelle conversation" + badge unread */}
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate ${
                        (conv.unread_count || 0) > 0
                          ? 'text-gray-900 font-semibold'
                          : hasMessages
                          ? 'text-gray-500'
                          : 'text-[#e86c00] italic font-medium'
                      }`}
                    >
                      {!hasMessages ? (
                        'Nouvelle conversation'
                      ) : (
                        <>
                          {isOwnLastMsg && <span className="text-gray-400">Vous : </span>}
                          {previewMessage(lastMsg.content)}
                        </>
                      )}
                    </p>

                    {(conv.unread_count || 0) > 0 && (
                      <span className="flex-shrink-0 min-w-5 h-5 px-1.5 bg-[#e86c00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conv.unread_count! > 99 ? '99+' : conv.unread_count}
                      </span>
                    )}
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
