'use client';

import { useState, useEffect, useCallback } from 'react';
import { marketplaceService, type PriceBounds } from '../services/marketplace.service';
import type { Product, MarketplaceFilters } from '../types';

const DEFAULT_FILTERS: MarketplaceFilters = {
  categories: [],
  seller_types: [],
  regions: [],
  price_min: 0,
  price_max: 0,        /* ✅ 0 = "pas de limite" (dynamique) */
  delivery_modes: [],
  badges: [],
  search: '',
  sort: 'recent',
};

export function useMarketplace() {
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceBounds, setPriceBounds] = useState<PriceBounds>({ min: 0, max: 100000 });

  /* Charger les bornes de prix dynamiques au démarrage */
  useEffect(() => {
    marketplaceService.getPriceBounds().then((bounds) => {
      setPriceBounds(bounds);
      /* Initialiser les filtres avec les vraies bornes */
      setFilters((prev) => ({
        ...prev,
        price_min: bounds.min,
        price_max: bounds.max,
      }));
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const results = await marketplaceService.getProducts(filters);
      setProducts(results);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = <K extends keyof MarketplaceFilters>(
    key: K,
    value: MarketplaceFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends keyof MarketplaceFilters>(
    key: K,
    value: string
  ) => {
    setFilters((prev) => {
      const arr = prev[key] as unknown as string[];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: next } as MarketplaceFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      price_min: priceBounds.min,
      price_max: priceBounds.max,
    });
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.seller_types.length +
    filters.regions.length +
    filters.delivery_modes.length +
    filters.badges.length +
    (filters.price_min !== priceBounds.min || filters.price_max !== priceBounds.max
      ? 1
      : 0);

  return {
    filters,
    products,
    loading,
    priceBounds,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    activeFiltersCount,
    refresh: load,
  };
}
