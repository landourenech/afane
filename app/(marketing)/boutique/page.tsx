"use client"

import { ShopComponent } from "@/components/shop/ShopComponent"
import Image from "next/image"

export default function Page() {
  return (
    // <main className="container mx-auto grid md:grid-cols-[280px_1fr] gap-8 py-8">
    //   <FilterSidebar products={products} />

    //   <section className="space-y-8">
    //     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    //       <SearchBar value={search} onChange={setSearch} />
    //       <CategoryTabs value={category} onValueChange={setCategory} />
    //     </div>

    //     <ProductGrid products={filteredProducts} />
    //   </section>
    // </main>
    <main>
            <div className="relative w-full h-50 md:h-80">
                    <Image 
                        src="/boutique.png" 
                        alt="logo" 
                        fill
                        className="object-cover" 
                    />
                    </div>
       
        <ShopComponent />

       
    </main>
  )
}
