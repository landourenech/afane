// Types partagés
export interface ShopItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  type: 'product' | 'equipment';
  // Produit
  quantity?: number;
  unit?: string;
  farmer_name?: string;
  // Équipement
  stock?: number;
  condition?: string;
  location?: string;
}

export interface ShopFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  type?: 'product' | 'equipment' | 'all';
}

export interface ShopResponse {
  items: ShopItem[];
  total: number;
  page: number;
  totalPages: number;
}