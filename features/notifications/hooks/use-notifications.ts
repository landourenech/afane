'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import type { Notification } from '../types';

export function useNotifications(userId: string | undefined, limit = 20) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await notificationService.getByUser(userId, limit);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    load();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    await notificationService.markAllAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const remove = async (id: string) => {
    await notificationService.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: load,
    markAsRead,
    markAllAsRead,
    remove,
  };
}
