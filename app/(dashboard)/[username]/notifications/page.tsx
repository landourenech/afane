'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  NotificationList,
  useNotifications,
} from '@/features/notifications';

type Filter = 'all' | 'unread' | 'read';

export default function NotificationsPage() {
  const params = useParams();
  const username = params?.username as string;
  const { profile } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    remove,
  } = useNotifications(profile?.id);

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[var(--afane-green)]">
            Notifications
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-[var(--afane-orange)] hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-1 mb-5 p-1 bg-[var(--bg-tertiary)] rounded-full">
        {(['all', 'unread', 'read'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
              filter === f
                ? 'bg-[var(--afane-green)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--afane-orange)]'
            }`}
          >
            {f === 'all' ? 'Toutes' : f === 'unread' ? 'Non lues' : 'Lues'}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
        <NotificationList
          notifications={filtered}
          loading={loading}
          onRead={markAsRead}
          onDelete={remove}
          emptyMessage={
            filter === 'unread'
              ? 'Aucune notification non lue'
              : filter === 'read'
              ? 'Aucune notification lue'
              : 'Aucune notification'
          }
        />
      </div>
    </div>
  );
}
