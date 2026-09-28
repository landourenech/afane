'use client';

import { useRouter } from 'next/navigation';
import {
  Bell, Package, ShoppingCart, MessageCircle, Users,
  AlertCircle, Clock, X, Trash2,
} from 'lucide-react';
import type { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

function getIcon(type: string) {
  switch (type) {
    case 'publication_created': return <Package className="h-4 w-4 text-blue-500" />;
    case 'publication_sold':    return <ShoppingCart className="h-4 w-4 text-green-500" />;
    case 'publication_expired': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'publication_cancelled': return <X className="h-4 w-4 text-red-500" />;
    case 'new_order':           return <ShoppingCart className="h-4 w-4 text-purple-500" />;
    case 'new_message':         return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'new_follower':        return <Users className="h-4 w-4 text-pink-500" />;
    case 'price_alert':         return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:                    return <Bell className="h-4 w-4 text-gray-500" />;
  }
}

function getIconBg(type: string): string {
  switch (type) {
    case 'publication_created': return 'bg-blue-100';
    case 'publication_sold':    return 'bg-green-100';
    case 'publication_expired': return 'bg-yellow-100';
    case 'publication_cancelled': return 'bg-red-100';
    case 'new_order':           return 'bg-purple-100';
    case 'new_message':         return 'bg-blue-100';
    case 'new_follower':        return 'bg-pink-100';
    case 'price_alert':         return 'bg-orange-100';
    default:                    return 'bg-gray-100';
  }
}

function formatDate(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function NotificationItem({
  notification,
  onRead,
  onDelete,
  showDelete = true,
}: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.read) onRead?.(notification.id);
    if (notification.link) router.push(notification.link);
  };

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${
        !notification.read ? 'bg-[var(--afane-orange)]/5' : ''
      }`}
      onClick={handleClick}
    >
      <div className={`p-2 rounded-full flex-shrink-0 ${getIconBg(notification.type)}`}>
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${!notification.read ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 bg-[var(--afane-orange)] rounded-full flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
          {notification.content}
        </p>
        <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
          {formatDate(notification.created_at)}
        </p>
      </div>

      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="p-1 hover:bg-[var(--bg-tertiary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Supprimer"
        >
          <Trash2 className="h-3 w-3 text-[var(--text-tertiary)]" />
        </button>
      )}
    </div>
  );
}
