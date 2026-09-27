'use client';

import Link from 'next/link';
import { CheckCircle2, Package, Home, ShoppingBag } from 'lucide-react';
import type { DeliveryInfo, OrderSummary } from '../types';
import { DELIVERY_OPTIONS } from '../types';

interface ConfirmationStepProps {
  orderId: string;
  delivery: DeliveryInfo;
  summary: OrderSummary;
  username: string;
}

export function ConfirmationStep({
  orderId,
  delivery,
  summary,
  username,
}: ConfirmationStepProps) {
  const eta = DELIVERY_OPTIONS[delivery.option].eta;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Succès */}
      <div className="p-5 bg-[var(--afane-green)]/10 rounded-full mb-4 animate-scale-in">
        <CheckCircle2 className="h-14 w-14 text-[var(--afane-green)]" strokeWidth={1.8} />
      </div>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
        Commande confirmée !
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
        Merci pour votre commande. Vous recevrez un email de confirmation avec tous les détails.
      </p>

      {/* Détails commande */}
      <div className="w-full max-w-md bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-5 text-left space-y-4">
        {/* Numéro */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)]">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-tertiary)]">
              Numéro de commande
            </p>
            <p className="text-sm font-bold text-[var(--afane-green)] mt-0.5">
              {orderId}
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[var(--afane-orange)]/10 text-[var(--afane-orange)] rounded-full">
            En préparation
          </span>
        </div>

        {/* Livraison */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[var(--afane-orange)]/10 rounded-lg flex-shrink-0">
            {delivery.option === 'pickup' ? (
              <Home className="h-4 w-4 text-[var(--afane-orange)]" />
            ) : (
              <Package className="h-4 w-4 text-[var(--afane-orange)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-tertiary)]">
              {delivery.option === 'pickup' ? 'Retrait' : 'Livraison'}
            </p>
            <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
              {DELIVERY_OPTIONS[delivery.option].label}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Délai estimé : {eta}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-[var(--border-primary)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Total payé</span>
            <span className="text-lg font-bold text-[var(--afane-green)]">
              {summary.total.toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full max-w-md">
        <Link
          href={`/${username}/orders`}
          className="flex-1 h-11 flex items-center justify-center gap-2 bg-[var(--afane-green)] text-white text-sm font-bold rounded-full hover:bg-[var(--afane-orange)] transition-colors"
        >
          Voir mes commandes
        </Link>
        <Link
          href={`/${username}/explore`}
          className="flex-1 h-11 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-semibold rounded-full hover:bg-[var(--border-secondary)] transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Continuer
        </Link>
      </div>
    </div>
  );
}
