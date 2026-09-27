'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { SORT_OPTIONS } from '../data/categories';
import type { MarketplaceFilters } from '../types';

interface SearchBarProps {
  filters: MarketplaceFilters;
  onUpdate: <K extends keyof MarketplaceFilters>(
    key: K,
    value: MarketplaceFilters[K]
  ) => void;
  onToggleMobileFilters: () => void;
  activeCount: number;
}

export function SearchBar({
  filters,
  onUpdate,
  onToggleMobileFilters,
  activeCount,
}: SearchBarProps) {
  return (
    <div className="space-y-3 mb-5">
      {/* Recherche + bouton filtres mobile */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onUpdate('search', e.target.value)}
            placeholder="Rechercher un produit, un vendeur..."
            className="w-full pl-10 pr-10 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--afane-green)] transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onUpdate('search', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--afane-orange)]/10"
              aria-label="Effacer"
            >
              <X className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
            </button>
          )}
        </div>

        {/* Bouton filtres mobile */}
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden flex items-center gap-2 px-4 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-primary)] hover:border-[var(--afane-orange)] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="min-w-5 h-5 px-1.5 bg-[var(--afane-orange)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Tri */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[11px] text-[var(--text-tertiary)] font-medium whitespace-nowrap mr-1">
          Trier :
        </span>
        {SORT_OPTIONS.map((opt) => {
          const isActive = filters.sort === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onUpdate('sort', opt.id as any)}
              className={`text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[var(--afane-green)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--afane-orange)]/10 hover:text-[var(--afane-orange)]'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
