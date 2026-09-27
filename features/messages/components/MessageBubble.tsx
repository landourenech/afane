'use client';

import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  senderPhoto?: string | null;
  senderName?: string | null;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  senderPhoto,
  senderName,
}: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isTemp = message.id.startsWith('temp-');

  return (
    <div
      className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar destinataire */}
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0 mb-1">
          {senderPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={senderPhoto}
              alt={senderName || ''}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-[var(--afane-green)] rounded-full flex items-center justify-center text-[var(--text-inverse)] text-xs font-bold">
              {(senderName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {!isOwn && !showAvatar && <div className="w-8" />}

      {/* Bulle */}
      <div
        className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 shadow-sm ${
          isOwn
            ? 'bg-[var(--afane-orange)] text-[var(--text-inverse)] rounded-2xl rounded-br-md'
            : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-2xl rounded-bl-md'
        } ${isTemp ? 'opacity-60' : ''}`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isOwn
              ? 'text-[var(--text-inverse)]/70'
              : 'text-[var(--text-tertiary)]'
          }`}
        >
          <span className="text-[10px] font-medium">{time}</span>
          {isOwn && (
            <span className="text-[10px]">
              {message.read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
