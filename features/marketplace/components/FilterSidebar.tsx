'use client';

import { X } from 'lucide-react';
import {
  CATEGORIES,
  REGIONS,
  SELLER_TYPES,
  DELIVERY_MODES,
  BADGES,
} from '../data/categories';
import { PRICE_BOUNDS } from '../types';
import { PriceSlider } from './PriceSlider';
import { Checkbox } from './Checkbox';
import type { MarketplaceFilters } from '../types';

interface FilterSidebarProps {
  filters: MarketplaceFilters;
  onToggle: (key: keyof MarketplaceFilters, value: string) => void;
  onUpdate: <K extends keyof MarketplaceFilters>(
    key: K,
    value: MarketplaceFilters[K]
  ) => void;
  onReset: () => void;
  activeCount: number;
}

export function FilterSidebar({
  filters,
  onToggle,
  onUpdate,
  onReset,
  activeCount,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6 pb-6">
      {/* Reset */}
      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[var(--afane-orange)] bg-[var(--afane-orange)]/5 hover:bg-[var(--afane-orange)]/10 transition-colors"
        >
          <span>Réinitialiser ({activeCount})</span>
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Catégories */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
          Catégories
        </h3>
        <div className="space-y-0.5">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <Checkbox
              key={cat.id}
              checked={filters.categories.includes(cat.id)}
              onChange={() => onToggle('categories', cat.id)}
              label={cat.label}
            />
          ))}
        </div>
      </section>

      {/* Prix */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
          Prix (FCFA/kg)
        </h3>
        <PriceSlider
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          valueMin={filters.price_min}
          valueMax={filters.price_max}
          onChangeMin={(v) => onUpdate('price_min', v)}
          onChangeMax={(v) => onUpdate('price_max', v)}
        />
      </section>

      {/* Type de vendeur */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
          Type de vendeur
        </h3>
        <div className="space-y-0.5">
          {SELLER_TYPES.map((st) => (
            <Checkbox
              key={st.id}
              checked={filters.seller_types.includes(st.id as any)}
              onChange={() => onToggle('seller_types', st.id)}
              label={st.label}
            />
          ))}
        </div>
      </section>

      {/* Région */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
          Localisation
        </h3>
        <div className="space-y-0.5">
          {REGIONS.map((r) => (
            <Checkbox
              key={r}
              checked={filters.regions.includes(r)}
              onChange={() => onToggle('regions', r)}
              label={r}
            />
          ))}
        </div>
      </section>

      {/* Livraison */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
          Livraison
        </h3>
        <div className="space-y-0.5">
          {DELIVERY_MODES.map((dm) => (
            <Checkbox
              key={dm.id}
              checked={filters.delivery_modes.includes(dm.id as any)}
              onChange={() => onToggle('delivery_modes', dm.id)}
              label={dm.label}
            />
          ))}
        </div>
      </section>

      {/* Badges */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
          Badges
        </h3>
        <div className="space-y-0.5">
          {BADGES.map((b) => (
            <Checkbox
              key={b.id}
              checked={filters.badges.includes(b.id as any)}
              onChange={() => onToggle('badges', b.id)}
              label={b.label}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
