'use client';

import { useState, useEffect, useCallback } from 'react';
import { marketplaceService } from '../services/marketplace.service';
import { PRICE_BOUNDS } from '../types';
import type { Product, MarketplaceFilters } from '../types';

const DEFAULT_FILTERS: MarketplaceFilters = {
  categories: [],
  seller_types: [],
  regions: [],
  price_min: PRICE_BOUNDS.min,
  price_max: PRICE_BOUNDS.max,
  delivery_modes: [],
  badges: [],
  search: '',
  sort: 'recent',
};

export function useMarketplace() {
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  /** Toggle une valeur dans un tableau (multi-select) */
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

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeFiltersCount =
    filters.categories.length +
    filters.seller_types.length +
    filters.regions.length +
    filters.delivery_modes.length +
    filters.badges.length +
    (filters.price_min !== PRICE_BOUNDS.min ? 1 : 0) +
    (filters.price_max !== PRICE_BOUNDS.max ? 1 : 0);

  return {
    filters,
    products,
    loading,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    activeFiltersCount,
    refresh: load,
  };
}
