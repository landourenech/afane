'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  username: string;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  local:     { bg: 'bg-[var(--afane-green)]',  text: 'text-white',     label: 'Local' },
  premium:   { bg: 'bg-[var(--afane-yellow)]', text: 'text-[#0c4428]', label: 'Premium' },
  exclusive: { bg: 'bg-[var(--afane-orange)]', text: 'text-white',     label: 'Collectif' },
};

export function ProductCard({
  product,
  username,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  const [groupStats, setGroupStats] = useState<{ count: number; quantity: number; min: number; complete: boolean } | null>(null);

  /* Charge la progression si vente groupée */
  useEffect(() => {
    const isGroup = product.badges.includes('exclusive');
    if (!isGroup) return;

    const supabase = createClient();
    supabase
      .from('group_sale_progress')
      .select('participants_count, total_quantity, min_group_quantity, is_complete')
      .eq('publication_id', product.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setGroupStats({
            count: data.participants_count || 0,
            quantity: data.total_quantity || 0,
            min: data.min_group_quantity || 0,
            complete: data.is_complete || false,
          });
        }
      });
  }, [product.id, product.badges]);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product);
  };

  const percent = groupStats && groupStats.min > 0
    ? Math.min(100, (groupStats.quantity / groupStats.min) * 100)
    : 0;

  return (
    <Link
      href={`/${username}/products/${product.id}`}
      className="group bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden transition-all duration-200 hover:border-[var(--afane-orange)] hover:shadow-[0_8px_24px_-8px_rgba(232,108,0,0.25)] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[var(--bg-tertiary)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {product.badges.map((badge) => {
              const style = BADGE_STYLES[badge];
              return (
                <span
                  key={badge}
                  className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
                >
                  {style.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Favori */}
        <button
          onClick={handleFav}
          className="absolute top-2.5 right-2.5 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 hover:bg-[var(--afane-orange)] group/fav"
          aria-label="Favori"
        >
          <Heart className="h-3.5 w-3.5 text-[var(--afane-green)] transition-colors group-hover/fav:text-white" />
        </button>

        {/* Rupture */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border border-white/40 rounded-full">
              Rupture
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-3.5">
        {/* Titre */}
        <h3 className="font-semibold text-[13px] text-[var(--text-primary)] line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* ✅ Progression groupée (si applicable) */}
        {groupStats && (
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="flex items-center gap-1 text-[var(--afane-orange)] font-semibold">
                <Users className="h-3 w-3" />
                {groupStats.count} participant{groupStats.count > 1 ? 's' : ''}
              </span>
              <span className="font-semibold text-[var(--text-tertiary)]">
                {groupStats.quantity}/{groupStats.min}
              </span>
            </div>
            <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  groupStats.complete
                    ? 'bg-[var(--afane-green)]'
                    : 'bg-gradient-to-r from-[var(--afane-orange)] to-[var(--afane-yellow)]'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Vendeur + note */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {product.seller.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.seller.avatar_url}
                alt={product.seller.name}
                className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                {product.seller.name.charAt(0)}
              </div>
            )}
            <span className="text-[11px] text-[var(--text-secondary)] truncate">
              {product.seller.name}
            </span>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="h-3 w-3 fill-[var(--afane-yellow)] text-[var(--afane-yellow)]" />
            <span className="text-[11px] font-semibold text-[var(--text-primary)]">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Localisation */}
        <p className="text-[11px] text-[var(--text-tertiary)] truncate mb-2.5">
          {product.location.city}, {product.location.region}
        </p>

        {/* Prix */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-lg font-bold text-[var(--afane-green)]">
            {product.price_per_kg.toLocaleString('fr-FR')}
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)] font-medium">
            FCFA/{product.unit}
          </span>
        </div>

        {/* Stock + bouton */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-[var(--text-tertiary)]">
            {product.quantity_available} {product.unit}
          </span>

          <button
            onClick={handleCart}
            disabled={!product.in_stock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
              product.in_stock
                ? 'bg-[var(--afane-green)] text-white hover:bg-[var(--afane-orange)] active:scale-95'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-3 w-3" />
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
}
