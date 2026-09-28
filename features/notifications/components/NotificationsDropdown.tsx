'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  ShoppingCart,
  MessageCircle,
  Users,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import type { Notification } from '../types';

function getIcon(type: string) {
  switch (type) {
    case 'publication_created': return <Package className="h-4 w-4 text-blue-500" />;
    case 'publication_sold':    return <ShoppingCart className="h-4 w-4 text-green-500" />;
    case 'publication_expired': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'publication_cancelled': return <X className="h-4 w-4 text-red-500" />;
    case 'new_order':           return <ShoppingCart className="h-4 w-4 text-purple-500" />;
    case 'order_confirmed':     return <ShoppingCart className="h-4 w-4 text-blue-500" />;
    case 'order_shipped':       return <ShoppingCart className="h-4 w-4 text-indigo-500" />;
    case 'order_delivered':     return <ShoppingCart className="h-4 w-4 text-green-500" />;
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
    case 'order_confirmed':     return 'bg-blue-100';
    case 'order_shipped':       return 'bg-indigo-100';
    case 'order_delivered':     return 'bg-green-100';
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

export default function NotificationsDropdown() {
  const { profile } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ✅ Utiliser le hook (Supabase direct) */
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
  } = useNotifications(profile?.id);

  /* Fermer au clic extérieur */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Fermer avec Escape */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClickNotification = async (n: Notification) => {
    if (!n.read) await markAsRead(n.id);
    if (n.link) {
      router.push(n.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[var(--bg-hover)] rounded-full transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-5 w-5 text-[var(--text-secondary)]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-[var(--afane-orange)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] sm:w-[400px] bg-[var(--bg-primary)] rounded-2xl shadow-xl border border-[var(--border-primary)] z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[var(--afane-orange)]/10 text-[var(--afane-orange)] rounded-full text-xs">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-[var(--afane-orange)] hover:underline font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout lire
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group flex items-start gap-3 px-4 py-3 border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${
                    !n.read ? 'bg-[var(--afane-orange)]/5' : ''
                  }`}
                  onClick={() => handleClickNotification(n)}
                >
                  <div className={`p-2 rounded-full flex-shrink-0 ${getIconBg(n.type)}`}>
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 bg-[var(--afane-orange)] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
                      {n.content}
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                      {formatDate(n.created_at)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(n.id);
                    }}
                    className="p-1 hover:bg-[var(--bg-tertiary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3 text-[var(--text-tertiary)]" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-[var(--text-tertiary)]" />
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium">Aucune notification</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Vous êtes à jour !</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[var(--border-primary)] text-center bg-[var(--bg-secondary)]">
              <button
                onClick={() => {
                  router.push(`/${profile?.username}/notifications`);
                  setIsOpen(false);
                }}
                className="text-xs text-[var(--afane-orange)] hover:underline font-medium"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
