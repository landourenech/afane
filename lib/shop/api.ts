// API calls - Backend
import { ShopFilters, ShopItem, ShopResponse } from './types';

const BASE_URL = '/api/shop';

export async function fetchProducts(): Promise<ShopItem[]> {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data.products;
}

export async function fetchEquipments(): Promise<ShopItem[]> {
  const response = await fetch(`${BASE_URL}/equipments`);
  if (!response.ok) throw new Error('Failed to fetch equipments');
  const data = await response.json();
  return data.equipments;
}

export async function fetchShopItems(filters?: Partial<ShopFilters>): Promise<ShopItem[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
  if (filters?.type) params.set('type', filters.type);

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to search');
  const data = await response.json();
  return data.items;
}

export async function addToCart(itemId: string, quantity: number): Promise<void> {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, quantity }),
  });
  if (!response.ok) throw new Error('Failed to add to cart');
}