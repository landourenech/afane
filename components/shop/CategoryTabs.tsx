'use client';

import { useMemo } from 'react';

interface CategoryTabsProps {
  items: { category: string }[];
  value: string;
  onValueChange: (value: string) => void;
}

export function CategoryTabs({ items, value, onValueChange }: CategoryTabsProps) {
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('tout');
    items.forEach(item => cats.add(item.category));
    return Array.from(cats);
  }, [items]);

  return (
    <div className="flex overflow-x-auto gap-2 pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onValueChange(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${
            value === cat
              ? 'bg-[var(--color-secondary)] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {cat === 'tout' ? 'Tout' : cat}
        </button>
      ))}
    </div>
  );
}