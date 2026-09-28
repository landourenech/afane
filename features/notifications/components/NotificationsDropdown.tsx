'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2, 
  Package, 
  ShoppingCart, 
  MessageCircle,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsDropdown() {
  const { profile } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!profile) return;
    
    try {
      const response = await fetch(`/api/notifications?userId=${profile.id}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  }, [profile]);

  useEffect(() => {
    loadNotifications();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Fermer le dropdown quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Marquer une notification comme lue
  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Marquer toutes comme lues
  const handleMarkAllAsRead = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une notification
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Icône selon le type
  const getIcon = (type: string) => {
    switch (type) {
      case 'publication_created':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'publication_sold':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'publication_expired':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'publication_cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      case 'new_order':
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      case 'new_message':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'new_follower':
        return <Users className="h-4 w-4 text-pink-500" />;
      case 'price_alert':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Couleur de fond selon le type
  const getIconBackground = (type: string) => {
    switch (type) {
      case 'publication_created':
        return 'bg-blue-100';
      case 'publication_sold':
        return 'bg-green-100';
      case 'publication_expired':
        return 'bg-yellow-100';
      case 'publication_cancelled':
        return 'bg-red-100';
      case 'new_order':
        return 'bg-purple-100';
      case 'new_message':
        return 'bg-blue-100';
      case 'new_follower':
        return 'bg-pink-100';
      case 'price_alert':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Formater la date relative
  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return notifDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadNotifications();
          }
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] sm:w-[400px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout lire
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification.id);
                    }
                    if (notification.link) {
                      router.push(notification.link);
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className={`p-2 rounded-full flex-shrink-0 ${getIconBackground(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {notification.content}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Aucune notification</p>
                <p className="text-xs text-gray-400 mt-1">
                  Vous êtes à jour !
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-200 text-center bg-gray-50">
              <button
                onClick={() => {
                  router.push(`/${profile?.username}/notifications`);
                  setIsOpen(false);
                }}
                className="text-xs text-[var(--color-secondary)] hover:underline font-medium"
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