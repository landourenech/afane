'use client';

import { Search, X } from 'lucide-react';
import type { MarketplaceFilters } from '../types';

interface MarketplaceHeaderProps {
  filters: MarketplaceFilters;
  onUpdate: <K extends keyof MarketplaceFilters>(
    key: K,
    value: MarketplaceFilters[K]
  ) => void;
}

const SORT_OPTIONS = [
  { id: 'recent',     label: 'Plus récents' },
  { id: 'price_asc',  label: 'Prix croissant' },
  { id: 'price_desc', label: 'Prix décroissant' },
  { id: 'rating',     label: 'Mieux notés' },
  { id: 'popular',    label: 'Plus populaires' },
];

export function MarketplaceHeader({ filters, onUpdate }: MarketplaceHeaderProps) {
  return (
    <div className="space-y-3 mb-4">
      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onUpdate('search', e.target.value)}
          placeholder="Rechercher un produit, un vendeur..."
          className="w-full pl-10 pr-10 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-2xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
        />
        {filters.search && (
          <button
            onClick={() => onUpdate('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-hover)]"
            aria-label="Effacer"
          >
            <X className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
          </button>
        )}
      </div>

      {/* Tri */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onUpdate('sort', opt.id as any)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border ${
              filters.sort === opt.id
                ? 'bg-[var(--afane-green)] text-white border-[var(--afane-green)] font-semibold'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--afane-green)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
