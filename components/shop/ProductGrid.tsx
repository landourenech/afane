import { ProductCard } from "@/components/shop/ProductCart";
import { ShopItem } from "@/app/lib/definition";

interface ProductGridProps {
  items: ShopItem[];
}

export function ProductGrid({
  items,
}: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
        Aucune offre trouvée.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ProductCard
          key={`${item.type}-${item.id}`}
          item={item}
        />
      ))}
    </div>
  );
}