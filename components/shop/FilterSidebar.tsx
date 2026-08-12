"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ShopItem } from "@/app/lib/definition";

interface FilterSidebarProps {
  items: ShopItem[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onPriceRangeChange: (value: readonly number[]) => void;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 100000;

export function FilterSidebar({
  items,
  selectedCategory,
  onCategoryChange,
  onPriceRangeChange,
}: FilterSidebarProps) {
  const categories = Array.from(
    new Set(items.map((item) => item.category))
  );

  const [priceRange, setPriceRange] = useState<readonly number[]>([
    DEFAULT_MIN_PRICE,
    DEFAULT_MAX_PRICE,
  ]);

  const handlePriceChange = (
    value: number | readonly number[]
  ) => {
    if (!Array.isArray(value)) return;

    setPriceRange(value);
    onPriceRangeChange(value);
  };

  const resetPrice = () => {
    const defaultRange = [
      DEFAULT_MIN_PRICE,
      DEFAULT_MAX_PRICE,
    ] as const;

    setPriceRange(defaultRange);
    onPriceRangeChange(defaultRange);
  };

  return (
    <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm max-md:hidden">

      {/* TITRE */}
      <div>
        <h3 className="text-lg font-semibold">
          Filtres
        </h3>

        <p className="mt-2 text-sm text-[var(--color-quaternary)]">
          Affinez votre recherche par type, catégorie ou prix.
        </p>
      </div>

      {/* TYPE */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">
          Type
        </h3>

        <div className="space-y-2">

          <button
            type="button"
            onClick={() => onCategoryChange("tout")}
            className={
              selectedCategory === "tout"
                ? "btn btn-category-active "
                : "btn btn-category "
            }
          >
            Toutes
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange("product")}
            className={
              selectedCategory === "product"
                ? "btn btn-category-active "
                : "btn btn-category "
            }
          >
            Récoltes
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange("equipment")}
            className={
              selectedCategory === "equipment"
                ? "btn btn-category-active "
                : "btn btn-category "
            }
          >
            Équipements
          </button>

        </div>
      </div>

      {/* CATÉGORIES */}
      <div className="space-y-3">

        <h3 className="text-sm font-semibold">
          Catégories
        </h3>

        <div className="flex flex-wrap gap-2">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={
                selectedCategory === category
                  ? "btn btn-category-active"
                  : "btn btn-category"
              }
            >
              {category}
            </button>
          ))}

        </div>
      </div>

      {/* PRIX */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Prix
          </h3>

         <button
              type="button"
              onClick={resetPrice}
              className={
                priceRange[0] !== 0 || priceRange[1] !== 1000000000
                  ? "btn btn-category-active"
                  : "btn btn-category"
              }
            >
              Réinitialiser
         </button>
        </div>

        {/* VALEURS */}
        <div className="flex items-center justify-between text-sm font-medium">

          <span>
            {priceRange[0].toLocaleString("fr-FR")} XAF
          </span>

          <span className="text-slate-400">
            -
          </span>

          <span>
            {priceRange[1].toLocaleString("fr-FR")} XAF
          </span>

        </div>

        {/* SLIDER */}
        <Slider
          value={priceRange}
          min={DEFAULT_MIN_PRICE}
          max={DEFAULT_MAX_PRICE}
          
          step={1000}
          onValueChange={handlePriceChange}
        />

        {/* LIMITES */}
        <div className="flex justify-between text-xs text-slate-400">
          <span>0 XAF</span>
          <span>1 000 000 000 XAF</span>
        </div>

      </div>

    </aside>
  );
}