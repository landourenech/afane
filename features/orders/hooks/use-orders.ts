'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await orderService.getByUser(userId);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, loading, error, refresh: load };
}
