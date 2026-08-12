"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Product,
  Equipment,
  ShopItem,
} from "@/app/lib/definition";

import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SearchBar } from "@/components/shop/SearchBar";

interface ShopComposentProps {
  products: Product[];
  equipments: Equipment[];
}

export function ShopComposent({
  products,
  equipments,
}: ShopComposentProps) {

  /* ========================================================= */
  /* ÉTATS                                                      */
  /* ========================================================= */

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("tout");

  const [priceRange, setPriceRange] =
    useState<readonly number[]>([0, 100000]);


  /* ========================================================= */
  /* PRODUITS + ÉQUIPEMENTS                                     */
  /* ========================================================= */

  const shopItems = useMemo<ShopItem[]>(() => {
    return [
      ...products.map((product) => ({
        ...product,
        type: "product" as const,
      })),

      ...equipments.map((equipment) => ({
        ...equipment,
        type: "equipment" as const,
      })),
    ];
  }, [products, equipments]);


  /* ========================================================= */
  /* FILTRAGE                                                    */
  /* ========================================================= */

  const filteredItems = useMemo(() => {

    const query = search.trim().toLowerCase();

    return shopItems.filter((item) => {

      /* RECHERCHE */
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);


      /* CATÉGORIE / TYPE */
      const matchesCategory =
        selectedCategory === "tout" ||
        item.type === selectedCategory ||
        item.category === selectedCategory;


      /* PRIX */
      const price = Number(item.price);

      const matchesPrice =
        price >= priceRange[0] &&
        price <= priceRange[1];


      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    });

  }, [
    shopItems,
    search,
    selectedCategory,
    priceRange,
  ]);


  /* ========================================================= */
  /* RENDER                                                      */
  /* ========================================================= */

  return (
    <main className="w-full space-y-6 p-4 md:p-6">

      {/* RECHERCHE */}
      <section className="space-y-4">

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center  ">
            
               <h2 className="  max-md:hidden">
              Boutique AFANE
            </h2>
            <SearchBar
                value={search}
                className="w-full flex-1"
                onChange={setSearch}
                placeholder="Rechercher un produit ou équipement..."
            />

            <Button
                className="
                
                "
            >
                <ShoppingCart className="size-4" />
                <span>Mon panier</span>
            </Button>
         </div>

        {/* CATÉGORIES RAPIDES */}
        {/* <CategoryTabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        /> */}

      </section>


      {/* BOUTIQUE */}
      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">

        {/* FILTRES */}
        <FilterSidebar
          items={shopItems}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPriceRangeChange={setPriceRange}
        />


        {/* PRODUITS */}
        <section className="space-y-4">

          <div>
         

            <p className="text-sm text-muted-foreground">
              {filteredItems.length} offre
              {filteredItems.length > 1 ? "s" : ""}
            </p>
          </div>


          <ProductGrid
            items={filteredItems}
          />

        </section>

      </section>

    </main>
  );
}