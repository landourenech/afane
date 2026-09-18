'use client';

import { PriceRangeFilter } from './PriceRangeFilter';
import { CategoryTabs } from './CategoryTabs';
import { ShopItem } from '@/types/shop/types';

interface FilterSidebarProps {
  items: ShopItem[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: readonly number[];
  onPriceRangeChange: (range: readonly number[]) => void;
}

export function FilterSidebar({
  items,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterSidebarProps) {
  return (
    <aside className="bg-white rounded-lg shadow-sm p-4 sticky top-20 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
        <CategoryTabs
          items={items}
          value={selectedCategory}
          onValueChange={onCategoryChange}
        />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
        <PriceRangeFilter
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      </div>
    </aside>
  );
}