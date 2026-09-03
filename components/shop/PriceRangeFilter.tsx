'use client';

interface PriceRangeFilterProps {
  value: readonly number[];
  onChange: (value: readonly number[]) => void;
  maxPrice?: number;
}

export function PriceRangeFilter({ value, onChange, maxPrice = 1000000 }: PriceRangeFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Prix maximum</p>
      <input
        type="range"
        min="0"
        max={maxPrice}
        step="10000"
        value={value[1]}
        onChange={(e) => onChange([0, parseInt(e.target.value)])}
        className="w-full accent-[#E86C00]"
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>0 FCFA</span>
        <span>{value[1].toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>
  );
}