import { ShopItem } from '../../types/shop/types';

export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

export function filterItems(
  items: ShopItem[],
  search: string,
  category: string,
  priceRange: readonly number[]
): ShopItem[] {
  // ✅ Correction : toLowerCase() au lieu de toLowerla Case()
  const query = search.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    const matchesCategory = category === 'tout' || 
      item.type === category || 
      item.category === category;

    const price = Number(item.price);
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });
}

export function getUniqueCategories(items: ShopItem[]): string[] {
  const categories = new Set<string>();
  categories.add('tout');
  items.forEach(item => categories.add(item.category));
  return Array.from(categories);
}

export function getStockLabel(item: ShopItem): string {
  if (item.type === 'product') {
    return `${item.quantity || 0} ${item.unit || 'unité'} disponibles`;
  }
  return `${item.stock || 0} disponibles`;
}