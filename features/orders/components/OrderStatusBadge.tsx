'use client';

import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const colors = ORDER_STATUS_COLORS[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wide rounded-full ${colors.bg} ${colors.text} ${
        size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'
      }`}
    >
      {label}
    </span>
  );
}
