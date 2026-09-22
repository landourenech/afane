'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/user';

interface DashboardStats {
  products: number;
  orders: number;
  messages: number;
  notifications: number;
}

export function useDashboardStats(
  userId: string | undefined,
  role: UserRole | undefined
) {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    messages: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      const supabase = createClient();

      try {
        const [products, orders, notifications] = await Promise.all([
          supabase
            .from('publications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId),
          supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`),
          supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false),
        ]);

        setStats({
          products: products.count || 0,
          orders: orders.count || 0,
          messages: 0,
          notifications: notifications.count || 0,
        });
      } catch (error) {
        console.error('Erreur stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId, role]);

  return { stats, loading };
}
