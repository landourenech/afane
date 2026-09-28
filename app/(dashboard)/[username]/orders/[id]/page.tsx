'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  OrderDetail,
  CancelOrderModal,
  useOrder,
  useCancelOrder,
} from '@/features/orders';

export default function OrderDetailPage() {
  const params = useParams();
  const username = params?.username as string;
  const orderId = params?.id as string;
  const { profile } = useAuth();

  const { order, loading, refresh } = useOrder(orderId);
  const { cancel, loading: cancelling } = useCancelOrder();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--border-primary)] border-t-[var(--afane-orange)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Commande introuvable
        </p>
      </div>
    );
  }

  const handleCancel = async (reason: string) => {
    await cancel(order.id, reason);
    await refresh();
  };

  return (
    <>
      <OrderDetail
        order={order}
        username={username}
        onCancel={() => setCancelOpen(true)}
      />

      <CancelOrderModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        orderNumber={order.order_number}
      />
    </>
  );
}
