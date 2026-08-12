import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { ShopItem } from "@/app/lib/definition";

interface ProductCardProps {
  item: ShopItem;
}

export function ProductCard({ item }: ProductCardProps) {
  return (
    <Card
      className="
        overflow-hidden rounded-2xl border-2
        border-[var(--color-secondary)]
        p-0
        text-[var(--color-tertairy)]
        shadow
        transition-all
        hover:shadow-lg
      "
    >
      <CardContent className="p-0">

        {/* IMAGE */}
        <div className="relative h-40 w-full overflow-hidden">

          <img
            src={
              item.image_url ||
              "/images/product-placeholder.jpg"
            }
            alt={item.name}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              hover:scale-105
            "
          />

          {/* TYPE — HAUT GAUCHE */}
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-white/90
              px-3
              py-1
              text-xs
              font-semibold
              shadow-sm
              backdrop-blur-sm
            "
          >
            {item.type === "equipment"
              ? "🚜 Équipement"
              : "🌱 Récolte"}
          </span>

          {/* PANIER — HAUT DROITE */}
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Ajouter ${item.name} au panier`}
            className="
              absolute
              right-3
              top-3
              size-9
              rounded-full
              bg-white/90
              text-[var(--color-secondary)]
              shadow-sm
              backdrop-blur-sm
              transition-all
              hover:bg-[var(--color-secondary)]
              hover:text-white
            "
          >
            <ShoppingBag className="size-5" />
          </Button>

        </div>

        {/* INFORMATIONS */}
        <div className="space-y-3 p-4">

          {/* NOM + CATÉGORIE */}
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold">
              {item.name}
            </h3>

            <p className="text-xs text-[var(--color-quaternary)]">
              {item.category}
            </p>
          </div>

          {/* PRIX */}
          <p className="text-xs">
            XAF{" "}
            <span className="pl-2 text-lg font-bold text-[var(--color-secondary)]">
              {item.price.toLocaleString("fr-FR")}
            </span>
          </p>

          {/* DESCRIPTION */}
          <p className="line-clamp-2 text-sm">
            {item.description ??
              "Description non disponible."}
          </p>

          {/* STOCK */}
          {item.type === "product" ? (
            <p className="text-sm">
              {item.quantity} {item.unit} disponibles
            </p>
          ) : (
            <p className="text-sm">
              {item.stock} disponibles
            </p>
          )}

          {/* AGRICULTEUR */}
          {item.type === "product" &&
            item.farmer_name && (
              <p className="text-sm">
                Par{" "}
                <span className="font-medium">
                  {item.farmer_name}
                </span>
              </p>
            )}

        </div>
      </CardContent>
    </Card>
  );
}