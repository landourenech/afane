'use client';

import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  username: string;
  role?: 'buyer' | 'seller';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function OrderCard({ order, username, role = 'buyer' }: OrderCardProps) {
  const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const itemLabel = order.items?.length === 1 ? 'article' : 'articles';

  return (
    <Link
      href={`/${username}/orders/${order.id}`}
      className="block bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 hover:border-[var(--afane-orange)] transition-all group"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-mono font-semibold text-[var(--afane-green)] truncate">
            {order.order_number}
          </span>
        </div>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      {/* Images des produits */}
      {order.items && order.items.length > 0 && (
        <div className="flex gap-1.5 mb-3">
          {order.items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-[var(--text-tertiary)]" />
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] flex-shrink-0">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Détails */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-[var(--text-tertiary)]">
            {formatDate(order.created_at)}
            {itemCount > 0 && ` · ${itemCount} ${itemLabel}`}
          </p>
          <p className="text-sm font-bold text-[var(--afane-green)] mt-0.5">
            {order.total.toLocaleString('fr-FR')} F
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--afane-orange)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}
