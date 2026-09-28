'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/checkout';

interface CartHeaderButtonProps {
  username: string;
}

export function CartHeaderButton({ username }: CartHeaderButtonProps) {
  const router = useRouter();
  const { count } = useCart();

  return (
    <button
      onClick={() => router.push(`/${username}/checkout`)}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Panier"
    >
      <ShoppingBag className="h-5 w-5 text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[var(--afane-orange)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
