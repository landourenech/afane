'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { ShopItem } from '@/types/shop/types';
import { formatPrice, getStockLabel } from '@/lib/shop/utils';

interface ProductCardProps {
  item: ShopItem;
  onAddToCart?: (item: ShopItem) => void;
}

export function ProductCard({ item, onAddToCart }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigation vers le détail du produit
    router.push(`/boutique/${item.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="overflow-hidden rounded-2xl border-2 border-[#E86C00]/20 bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
    >
      {/* IMAGE */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
        )}

        {/* TYPE */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm">
          {item.type === 'equipment' ? '🚜 Équipement' : '🌱 Produit'}
        </span>

        {/* BOUTON AJOUTER */}
        <button
          onClick={handleAddToCart}
          aria-label={`Ajouter ${item.name} au panier`}
          className="absolute right-3 top-3 size-9 rounded-full bg-white/90 text-[#E86C00] shadow-sm transition-all hover:bg-[#E86C00] hover:text-white"
        >
          <ShoppingBag className="size-4 mx-auto" />
        </button>
      </div>

      {/* INFORMATIONS */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
        </div>

        <p className="text-lg font-bold text-[#E86C00]">
          {formatPrice(item.price)}
        </p>

        <p className="line-clamp-2 text-xs text-gray-600">
          {item.description || 'Description non disponible.'}
        </p>

        <p className="text-xs text-gray-500">
          {getStockLabel(item)}
        </p>

        {item.farmer_name && (
          <p className="text-xs text-gray-500">
            Par <span className="font-medium">{item.farmer_name}</span>
          </p>
        )}
      </div>
    </div>
  );
}