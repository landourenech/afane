'use client';

import { Package, ShoppingBag } from 'lucide-react';
import { OrderCard } from './OrderCard';
import type { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  username: string;
  role?: 'buyer' | 'seller';
  emptyMessage?: string;
}

export function OrderList({
  orders,
  loading,
  username,
  role = 'buyer',
  emptyMessage = 'Aucune commande',
}: OrderListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 animate-pulse"
          >
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/3" />
              <div className="h-5 bg-[var(--bg-tertiary)] rounded-full w-20" />
            </div>
            <div className="flex gap-1.5 mb-3">
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg" />
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg" />
            </div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-[var(--bg-tertiary)] rounded-full mb-3">
          {role === 'buyer' ? (
            <ShoppingBag className="h-8 w-8 text-[var(--text-tertiary)]" />
          ) : (
            <Package className="h-8 w-8 text-[var(--text-tertiary)]" />
          )}
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
          {emptyMessage}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          {role === 'buyer'
            ? 'Vos futures commandes apparaîtront ici'
            : 'Vos futures ventes apparaîtront ici'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          username={username}
          role={role}
        />
      ))}
    </div>
  );
}
