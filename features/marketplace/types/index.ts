export type SellerType = 'producer' | 'cooperative' | 'supplier' | 'shop';
export type DeliveryMode = 'pickup' | 'delivery' | 'express';
export type ProductBadge = 'local' | 'premium' | 'exclusive';
export type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

export interface Product {
  id: string;
  title: string;
  image_url: string;
  price_per_kg: number;
  currency: string;
  quantity_available: number;
  unit: 'kg' | 'g' | 'tonne' | 'sac' | 'litre';
  rating: number;
  reviews_count: number;
  seller: {
    id: string;
    name: string;
    avatar_url: string | null;
    type: SellerType;
    verified: boolean;
  };
  location: {
    city: string;
    region: string;
    country: string;
  };
  badges: ProductBadge[];
  category: string;
  delivery_modes: DeliveryMode[];
  in_stock: boolean;
}

export interface MarketplaceFilters {
  categories: string[];          /* multi-select */
  seller_types: SellerType[];    /* multi-select */
  regions: string[];             /* multi-select */
  price_min: number;
  price_max: number;
  delivery_modes: DeliveryMode[]; /* multi-select */
  badges: ProductBadge[];         /* multi-select */
  search: string;
  sort: SortOption;
}

export const PRICE_BOUNDS = {
  min: 0,
  max: 10000,
  step: 100,
} as const;
