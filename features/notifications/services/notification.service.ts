import type { Notification } from '../types';

export const notificationService = {
  async getByUser(userId: string, limit = 20): Promise<{
    notifications: Notification[];
    unreadCount: number;
  }> {
    const response = await fetch(`/api/notifications?userId=${userId}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  async markAsRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  async delete(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
  },
};
