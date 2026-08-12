import Image from "next/image";

import { fetchShopData } from "@/app/lib/querie";
import { ShopComposent } from "@/components/shop/ShopComposent";

export default async function BoutiquePage() {
  const { products, equipments } = await fetchShopData();

  return (
    <main >
      {/* BANNIÈRE */}

      <div className="relative h-50 w-full md:h-80">
        <Image
          src="/boutique.png"
          alt="Boutique AFANE"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* BOUTIQUE */}

      <ShopComposent
        products={products}
        equipments={equipments}
      />
    </main>
  );
}