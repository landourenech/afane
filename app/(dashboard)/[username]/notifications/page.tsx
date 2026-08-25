'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
  ArrowLeft,
} from 'lucide-react';

export default function NotificationsPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  const loadNotifications = useCallback(async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${profile.id}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const handleMarkAllAsRead = async () => {
    if (!profile) return;
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id }),
      });
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${username}`} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 rounded-md transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Filtres */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'unread', label: 'Non lues' },
              { id: 'read', label: 'Lues' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  filter === f.id
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Liste */}
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                    <Bell className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Aucune notification.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}