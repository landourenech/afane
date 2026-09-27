'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, Info, MessageCircle } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
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

  // Auto-scroll en bas quand nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50 text-center p-6">
        <div className="p-6 bg-white rounded-full mb-4 shadow-sm">
          <MessageCircle className="h-12 w-12 text-[#e86c00]" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Vos messages
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Sélectionnez une conversation pour commencer à discuter
        </p>
      </div>
    );
  }

  const otherUser = conversation.other_user;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ═════ Header ═════ */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        {/* Bouton retour (mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 -ml-1 rounded-full hover:bg-gray-100 md:hidden"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Avatar + Nom */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {otherUser?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={otherUser.avatar_url}
              alt={otherUser.display_name || ''}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#0c4428] to-[#e86c00] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {(otherUser?.display_name || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {otherUser?.display_name || 'Utilisateur'}
            </p>
            {otherUser?.username && (
              <p className="text-xs text-gray-500 truncate">
                @{otherUser.username}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Appel audio"
          >
            <Phone className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Appel vidéo"
          >
            <Video className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors hidden md:inline-flex"
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
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#e86c00]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-gray-400">
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
                senderName={otherUser?.display_name}
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
