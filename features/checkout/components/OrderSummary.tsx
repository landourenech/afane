'use client';

import { Tag } from 'lucide-react';
import type { OrderSummary as Summary } from '../types';

interface OrderSummaryProps {
  summary: Summary;
  itemCount: number;
}

export function OrderSummary({ summary, itemCount }: OrderSummaryProps) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 sticky top-4">
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">
        Récapitulatif
      </h3>

      <div className="space-y-2.5 text-sm">
        {/* Sous-total */}
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">
            Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})
          </span>
          <span className="font-semibold text-[var(--text-primary)]">
            {summary.subtotal.toLocaleString('fr-FR')} F
          </span>
        </div>

        {/* Livraison */}
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Livraison</span>
          <span className={`font-semibold ${summary.deliveryCost === 0 ? 'text-[var(--afane-green)]' : 'text-[var(--text-primary)]'}`}>
            {summary.deliveryCost === 0 ? 'Gratuit' : `${summary.deliveryCost.toLocaleString('fr-FR')} F`}
          </span>
        </div>

        {/* Frais de service */}
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Frais de service</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {summary.serviceFee.toLocaleString('fr-FR')} F
          </span>
        </div>

        {/* Réduction */}
        {summary.discount > 0 && (
          <div className="flex items-center justify-between text-[var(--afane-orange)]">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Réduction
            </span>
            <span className="font-semibold">
              −{summary.discount.toLocaleString('fr-FR')} F
            </span>
          </div>
        )}

        {/* Total */}
        <div className="pt-3 mt-1 border-t border-[var(--border-primary)] flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--text-primary)]">
            Total
          </span>
          <span className="text-xl font-bold text-[var(--afane-green)]">
            {summary.total.toLocaleString('fr-FR')} F
          </span>
        </div>
      </div>

      {/* Garantie */}
      <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
        <div className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)]">
          <span className="text-base leading-none">🔒</span>
          <p className="leading-relaxed">
            Paiement 100% sécurisé. Remboursement garanti si non conforme.
          </p>
        </div>
      </div>
    </div>
  );
}
