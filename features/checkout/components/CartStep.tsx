'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItemRow } from './CartItemRow';
import type { CartItem } from '../types';

interface CartStepProps {
  items: CartItem[];
  username: string;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onNext: () => void;
  canContinue: boolean;
}

export function CartStep({
  items,
  username,
  onUpdateQuantity,
  onRemove,
  onNext,
  canContinue,
}: CartStepProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-5 bg-[var(--bg-tertiary)] rounded-full mb-4">
          <ShoppingBag className="h-10 w-10 text-[var(--text-tertiary)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
          Votre panier est vide
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-5">
          Ajoutez des produits pour commencer
        </p>
        <Link
          href={`/${username}/explore`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--afane-green)] text-white text-sm font-semibold rounded-full hover:bg-[var(--afane-orange)] transition-colors"
        >
          Explorer la boutique
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Liste */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] px-4">
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            username={username}
            onUpdateQuantity={(q) => onUpdateQuantity(item.productId, q)}
            onRemove={() => onRemove(item.productId)}
          />
        ))}
      </div>

      {/* Info livraison gratuite */}
      <div className="mt-4 p-3 bg-[var(--afane-green)]/5 rounded-xl text-xs text-[var(--text-secondary)] flex items-center gap-2">
        <span className="text-lg">🚚</span>
        <span>Livraison gratuite à partir de 25 000 F d'achat</span>
      </div>

      {/* Continuer */}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="mt-5 w-full h-12 flex items-center justify-center gap-2 bg-[var(--afane-green)] text-white text-sm font-bold rounded-full hover:bg-[var(--afane-orange)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continuer vers la livraison
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
