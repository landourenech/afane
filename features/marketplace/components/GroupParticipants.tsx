'use client';

import { Users, Crown } from 'lucide-react';
import type { GroupParticipant } from '../services/group-sale.service';

interface GroupParticipantsProps {
  participants: GroupParticipant[];
  currentUserId?: string;
  maxDisplay?: number;
}

export function GroupParticipants({
  participants,
  currentUserId,
  maxDisplay = 5,
}: GroupParticipantsProps) {
  if (participants.length === 0) return null;

  const displayed = participants.slice(0, maxDisplay);
  const remaining = participants.length - maxDisplay;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1.5">
        <Users className="h-3 w-3" />
        Participants ({participants.length})
      </p>

      <div className="space-y-1.5">
        {displayed.map((p, i) => {
          const isMe = p.user_id === currentUserId;
          const isFirst = i === 0;

          return (
            <div
              key={p.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isMe ? 'bg-[var(--afane-orange)]/10 border border-[var(--afane-orange)]/30' : 'bg-[var(--bg-tertiary)]'
              }`}
            >
              {p.user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.user.avatar_url}
                  alt={p.user.display_name || ''}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {(p.user?.display_name || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${isMe ? 'font-semibold text-[var(--afane-orange)]' : 'text-[var(--text-primary)]'}`}>
                  {isMe ? 'Vous' : p.user?.display_name || 'Utilisateur'}
                  {isFirst && !isMe && <Crown className="inline h-3 w-3 ml-1 text-yellow-500" />}
                </p>
              </div>

              <span className="text-[10px] text-[var(--text-tertiary)] flex-shrink-0">
                {p.quantity} u.
              </span>
            </div>
          );
        })}

        {remaining > 0 && (
          <p className="text-[10px] text-[var(--text-tertiary)] text-center pt-1">
            +{remaining} autre{remaining > 1 ? 's' : ''} participant{remaining > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
