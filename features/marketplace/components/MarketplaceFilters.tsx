'use client';

import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  CATEGORIES,
  REGIONS,
  SELLER_TYPES,
  DELIVERY_MODES,
  BADGES,
} from '../data/categories';
import type { MarketplaceFilters as Filters } from '../types';

interface MarketplaceFiltersProps {
  filters: Filters;
  onUpdate: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
  activeCount: number;
}

export function MarketplaceFilters({
  filters,
  onUpdate,
  onReset,
  activeCount,
}: MarketplaceFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleBadge = (badge: string) => {
    const current = filters.badges;
    const next = current.includes(badge as any)
      ? current.filter((b) => b !== badge)
      : [...current, badge as any];
    onUpdate('badges', next);
  };

  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] mb-4">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--afane-orange)]" />
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            Filtres
          </span>
          {activeCount > 0 && (
            <span className="min-w-5 h-5 px-1.5 bg-[var(--afane-orange)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[var(--text-tertiary)] transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-primary)] pt-4">
          {/* Catégorie */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
              Catégorie
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onUpdate('category', cat.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    filters.category === cat.id
                      ? 'bg-[var(--afane-orange)] text-white border-[var(--afane-orange)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--afane-orange)]'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type vendeur */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
              Type de vendeur
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {SELLER_TYPES.map((st) => (
                <button
                  key={st.id}
                  onClick={() =>
                    onUpdate(
                      'seller_type',
                      filters.seller_type === st.id ? null : (st.id as any)
                    )
                  }
                  className={`text-[11px] px-2.5 py-2 rounded-lg border text-left transition-colors ${
                    filters.seller_type === st.id
                      ? 'bg-[var(--afane-orange)] text-white border-[var(--afane-orange)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--afane-orange)]'
                  }`}
                >
                  {st.icon} {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Région */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
              Localisation
            </label>
            <select
              value={filters.region || ''}
              onChange={(e) => onUpdate('region', e.target.value || null)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            >
              <option value="">Toutes les régions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
              Prix (FCFA/kg)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.price_min ?? ''}
                onChange={(e) =>
                  onUpdate('price_min', e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Min"
                className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
              />
              <span className="text-[var(--text-tertiary)]">—</span>
              <input
                type="number"
                value={filters.price_max ?? ''}
                onChange={(e) =>
                  onUpdate('price_max', e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Max"
                className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
              />
            </div>
          </div>

          {/* Mode de livraison */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
              Mode de livraison
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DELIVERY_MODES.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() =>
                    onUpdate(
                      'delivery_mode',
                      filters.delivery_mode === dm.id ? null : (dm.id as any)
                    )
                  }
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    filters.delivery_mode === dm.id
                      ? 'bg-[var(--afane-green)] text-white border-[var(--afane-green)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--afane-green)]'
                  }`}
                >
                  {dm.icon} {dm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
              Badges
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BADGES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => toggleBadge(b.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    filters.badges.includes(b.id as any)
                      ? 'bg-[var(--afane-orange)] text-white border-[var(--afane-orange)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--afane-orange)]'
                  }`}
                >
                  {b.icon} {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="w-full py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}
