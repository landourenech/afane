'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

/* ══════════════════════════════════════════════════════════
   useOrders — Liste des commandes (acheteur)
   ══════════════════════════════════════════════════════════ */
export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

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

/* ══════════════════════════════════════════════════════════
   useSales — Ventes du vendeur
   ══════════════════════════════════════════════════════════ */
export function useSales(userId: string | undefined) {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await orderService.getSalesByUser(userId);
      setSales(data);
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

  return { sales, loading, error, refresh: load };
}

/* ══════════════════════════════════════════════════════════
   useOrder — Détail d'une commande
   ══════════════════════════════════════════════════════════ */
export function useOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await orderService.getById(orderId);
      setOrder(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  return { order, loading, error, refresh: load };
}

/* ══════════════════════════════════════════════════════════
   useCancelOrder — Annuler une commande
   ══════════════════════════════════════════════════════════ */
export function useCancelOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async (id: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.cancel(id, reason);
      return order;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cancel, loading, error };
}
