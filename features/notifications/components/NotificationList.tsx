'use client';

import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '../types';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export function NotificationList({
  notifications,
  loading,
  onRead,
  onDelete,
  emptyMessage = 'Aucune notification',
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-9 h-9 bg-[var(--bg-tertiary)] rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-3">
          <Bell className="h-6 w-6 text-[var(--text-tertiary)]" />
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-medium">{emptyMessage}</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">Vous êtes à jour !</p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onRead={onRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
