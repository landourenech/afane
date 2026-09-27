'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
  username: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, username, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const total = item.price_per_kg * item.quantity;

  return (
    <div className="flex gap-3 py-4 border-b border-[var(--border-primary)] last:border-b-0">
      {/* Image */}
      <Link
        href={`/${username}/products/${item.productId}`}
        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg-tertiary)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Détails */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/${username}/products/${item.productId}`}
              className="block font-semibold text-sm text-[var(--text-primary)] line-clamp-2 leading-snug hover:text-[var(--afane-orange)] transition-colors"
            >
              {item.title}
            </Link>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 truncate">
              Vendu par {item.sellerName}
            </p>
          </div>

          <button
            onClick={onRemove}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--afane-orange)]/10 group transition-colors"
            aria-label="Retirer"
          >
            <Trash2 className="h-3.5 w-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--afane-orange)] transition-colors" />
          </button>
        </div>

        <div className="flex items-end justify-between gap-2 mt-2">
          {/* Prix unitaire */}
          <div>
            <p className="text-[10px] text-[var(--text-tertiary)]">Prix unitaire</p>
            <p className="text-xs font-semibold text-[var(--afane-green)]">
              {item.price_per_kg.toLocaleString('fr-FR')} F/{item.unit}
            </p>
          </div>

          {/* Quantité */}
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-full p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--afane-orange)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Diminuer"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-8 text-center text-xs font-bold text-[var(--text-primary)]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--afane-orange)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Augmenter"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Total ligne */}
          <div className="text-right">
            <p className="text-[10px] text-[var(--text-tertiary)]">Total</p>
            <p className="text-sm font-bold text-[var(--afane-green)]">
              {total.toLocaleString('fr-FR')} F
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
