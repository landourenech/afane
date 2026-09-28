'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Package, X } from 'lucide-react';
import { useMarketplace } from '../hooks/use-marketplace';
import { useHideOnScroll } from '../hooks/use-hide-on-scroll';
import { useCart } from '@/features/checkout';
import { SearchBar } from './SearchBar';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { AdsCarousel } from './AdsCarousel';
import type { Product } from '../types';

export function Marketplace() {
  const params = useParams();
  const username = params?.username as string;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* Ref du conteneur scrollable (colonne produits) */
  const productsScrollRef = useRef<HTMLDivElement>(null);
  const hideSearch = useHideOnScroll(productsScrollRef);

  const {
    filters,
    products,
    loading,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    activeFiltersCount,
  } = useMarketplace();

  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      title: product.title,
      image_url: product.image_url,
      price_per_kg: product.price_per_kg,
      unit: product.unit,
      quantity: 1,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
      maxQuantity: product.quantity_available,
    });
  };

  const handleToggleFavorite = (product: Product) => {
    console.log('Favori:', product.title);
  };

  return (
    <div className="h-full flex flex-col">
      {/* ═══ Header (fixe en haut) ═══ */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--afane-green)]">
            Boutique
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Découvrez les produits frais du Gabon 🇬🇦
          </p>
        </div>
      </div>

      {/* ═══ Corps : 3 colonnes ═══ */}
      <div className="flex-1 min-h-0">
        <div className="max-w-[1400px] mx-auto h-full grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] xl:grid-cols-[280px_1fr_320px]">

          {/* ═══ COLONNE 1 : Filtres (desktop) — scroll indépendant ═══ */}
          <div className="hidden lg:block h-full overflow-y-auto border-r border-[var(--border-primary)] px-4 py-4 scrollbar-thin">
            <FilterSidebar
              filters={filters}
              onToggle={toggleArrayFilter as any}
              onUpdate={updateFilter}
              onReset={resetFilters}
              activeCount={activeFiltersCount}
            />
          </div>

          {/* ═══ COLONNE 2 : Produits — scroll indépendant ═══ */}
          <div
            ref={productsScrollRef}
            className="relative h-full overflow-y-auto scrollbar-thin"
          >
            {/* Barre de recherche — auto-hide on scroll */}
            <div
              className={`sticky top-0 z-20 bg-[var(--bg-secondary)] px-4 pt-4 pb-3 transition-transform duration-300 ease-out ${
                hideSearch ? '-translate-y-full' : 'translate-y-0'
              }`}
            >
              <SearchBar
                filters={filters}
                onUpdate={updateFilter}
                onToggleMobileFilters={() => setMobileFiltersOpen(true)}
                activeCount={activeFiltersCount}
              />
            </div>

            {/* Grille produits */}
            <div className="px-4 pb-6">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-[var(--bg-tertiary)]" />
                      <div className="p-3.5 space-y-2">
                        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
                        <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
                        <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/3" />
                        <div className="h-8 bg-[var(--bg-tertiary)] rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-full mb-3">
                    <Package className="h-8 w-8 text-[var(--text-tertiary)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                    Aucun produit trouvé
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Essayez de modifier vos filtres
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[11px] text-[var(--text-tertiary)] mb-3">
                    {products.length} produit{products.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        username={username}
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Pubs mobile (dans le scroll produit) */}
              <div className="lg:hidden pt-6">
                <AdsCarousel />
              </div>
            </div>
          </div>

          {/* ═══ COLONNE 3 : Pubs (desktop) — statique ═══ */}
          <div className="hidden lg:block h-full overflow-y-auto border-l border-[var(--border-primary)] px-4 py-4 scrollbar-thin">
            <AdsCarousel />
          </div>
        </div>
      </div>

      {/* ═══ Drawer filtres mobile ═══ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-[var(--bg-primary)] overflow-y-auto p-5 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-[var(--afane-green)]">
                Filtres
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--bg-hover)]"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 text-[var(--text-secondary)]" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onToggle={toggleArrayFilter as any}
              onUpdate={updateFilter}
              onReset={resetFilters}
              activeCount={activeFiltersCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}
