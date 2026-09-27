'use client';

import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Phone, CreditCard, X } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  CANCELLABLE_STATUSES,
  DELIVERY_LABELS,
  PAYMENT_LABELS,
} from '../types';
import type { Order } from '../types';

interface OrderDetailProps {
  order: Order;
  username: string;
  onCancel?: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderDetail({ order, username, onCancel }: OrderDetailProps) {
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href={`/${username}/orders`}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Commande
          </p>
          <p className="text-lg font-bold text-[var(--afane-green)] font-mono">
            {order.order_number}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Date */}
      <p className="text-xs text-[var(--text-tertiary)] mb-5">
        Passée le {formatDate(order.created_at)}
      </p>

      {/* Produits */}
      <section className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] mb-4 overflow-hidden">
        <div className="p-4 border-b border-[var(--border-primary)]">
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--afane-orange)]" />
            Produits ({order.items?.length || 0})
          </h2>
        </div>
        <div className="divide-y divide-[var(--border-primary)]">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-3 p-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-[var(--text-tertiary)]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--text-primary)] line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                  {item.quantity} {item.unit} × {item.price_per_unit.toLocaleString('fr-FR')} F
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-[var(--afane-green)]">
                  {item.line_total.toLocaleString('fr-FR')} F
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Livraison */}
      <section className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 mb-4">
        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-[var(--afane-orange)]" />
          Livraison
        </h2>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {DELIVERY_LABELS[order.delivery_option]}
        </p>
        {order.delivery_address && (
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {order.delivery_address}
            {order.delivery_city && `, ${order.delivery_city}`}
            {order.delivery_region && `, ${order.delivery_region}`}
          </p>
        )}
        <p className="text-xs text-[var(--text-secondary)] mt-2 flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          {order.delivery_phone}
        </p>
        {order.delivery_notes && (
          <p className="text-xs text-[var(--text-tertiary)] mt-2 italic">
            Note : {order.delivery_notes}
          </p>
        )}
      </section>

      {/* Paiement */}
      <section className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 mb-4">
        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-[var(--afane-orange)]" />
          Paiement
        </h2>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {PAYMENT_LABELS[order.payment_method]}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Statut : {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
        </p>
      </section>

      {/* Total */}
      <section className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Sous-total</span>
            <span className="font-semibold">
              {order.subtotal.toLocaleString('fr-FR')} F
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Livraison</span>
            <span className="font-semibold">
              {order.delivery_cost === 0
                ? 'Gratuit'
                : `${order.delivery_cost.toLocaleString('fr-FR')} F`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Frais de service</span>
            <span className="font-semibold">
              {order.service_fee.toLocaleString('fr-FR')} F
            </span>
          </div>
          <div className="pt-2 mt-2 border-t border-[var(--border-primary)] flex justify-between items-center">
            <span className="font-bold text-[var(--text-primary)]">Total</span>
            <span className="text-xl font-bold text-[var(--afane-green)]">
              {order.total.toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>
      </section>

      {/* Annulation */}
      {order.status === 'cancelled' && order.cancellation_reason && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 mb-4">
          <p className="text-xs font-semibold text-red-700 mb-1">
            Commande annulée
          </p>
          <p className="text-xs text-red-600">
            Motif : {order.cancellation_reason}
          </p>
        </div>
      )}

      {/* Bouton annuler */}
      {canCancel && onCancel && (
        <button
          onClick={onCancel}
          className="w-full h-12 flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm font-bold rounded-full hover:bg-red-100 transition-colors"
        >
          <X className="h-4 w-4" />
          Annuler la commande
        </button>
      )}
    </div>
  );
}
