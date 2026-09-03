'use client';

import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  count?: number;
  onClick?: () => void;
}

export function CartButton({ count = 0, onClick }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2.5 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Mon panier</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}