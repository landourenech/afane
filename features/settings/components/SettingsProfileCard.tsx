'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsProfileCardProps {
  username: string;
}

export function SettingsProfileCard({ username }: SettingsProfileCardProps) {
  const router = useRouter();
  const { profile, user } = useAuth();

  const displayName =
    profile?.display_name || user?.displayName || 'Utilisateur';
  const userEmail = profile?.email || user?.email || '';

  return (
    <button
      onClick={() => router.push(`/${username}/profile`)}
      className="w-full bg-[var(--bg-primary)] rounded-2xl p-4 mb-4 flex items-center gap-4 hover:bg-[var(--bg-hover)] active:bg-[var(--bg-tertiary)] transition-colors"
    >
      {profile?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar_url}
          alt={displayName}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-[var(--text-inverse)] font-bold text-xl flex-shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0 text-left">
        <p className="font-bold text-base text-[var(--text-primary)] truncate">
          {displayName}
        </p>
        {userEmail && (
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
            {userEmail}
          </p>
        )}
        {profile?.username && (
          <p className="text-xs text-[var(--afane-orange)] truncate mt-0.5">
            @{profile.username}
          </p>
        )}
      </div>
    </button>
  );
}
