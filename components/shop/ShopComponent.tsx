'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AdBanner } from './AdBanner';
import { SearchBar } from './SearchBar';
import { CategoryTabs } from './CategoryTabs';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { CartButton } from './CartButton';
import { ShopItem } from '@/types/shop/types';
import { filterItems, getUniqueCategories } from '@/lib/shop/utils';
import { 
  Package,
  Search,
  Filter,
  X,
} from 'lucide-react';

export function ShopComponent() {
  const router = useRouter();

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [priceRange, setPriceRange] = useState<readonly number[]>([0, 1000000]);
  const [cartCount, setCartCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Charger les publications actives depuis l'API
  const loadPublications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/publications?status=active&limit=50');
      if (response.ok) {
        const data = await response.json();
        const pubs: ShopItem[] = (data.publications || []).map((pub: any) => ({
          id: pub.id,
          name: pub.title,
          description: pub.description,
          price: pub.price,
          category: pub.main_category,
          image_url: pub.images?.[0] || null,
          type: 'product' as const,
          quantity: pub.quantity,
          unit: pub.unit,
          farmer_name: pub.seller?.display_name || pub.location || '',
        }));
        setItems(pubs);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  // Popup après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    return filterItems(items, search, selectedCategory, priceRange);
  }, [items, search, selectedCategory, priceRange]);

  const categories = useMemo(() => {
    return getUniqueCategories(items);
  }, [items]);

  const handleAddToCart = (item: ShopItem) => {
    setCartCount(prev => prev + 1);
    // Notification ou toast
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00]"></div>
      </div>
    );
  }

  return (
    <main className="w-full space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* POP-UP */}
      {showPopup && <AdBanner variant="popup" adId="shop-welcome-popup" />}

      {/* BANNIÈRE PUBLICITAIRE */}
      <AdBanner variant="banner" adId="shop-top-banner" />

      {/* RECHERCHE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un produit ou équipement..."
            className="flex-1"
          />
          <CartButton count={cartCount} />
        </div>

        {/* CATÉGORIES */}
        <CategoryTabs
          items={items.map(item => ({ category: item.category }))}
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        />
      </section>

      {/* FILTRES MOBILE */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <Filter className="h-4 w-4" />
          Filtres
        </button>
        
        {showFilters && (
          <div className="mt-3 bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Prix maximum</p>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-[#E86C00]"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0 FCFA</span>
              <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        )}
      </div>

      {/* CONTENU */}
      <section className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* FILTRES DESKTOP */}
        <aside className="hidden lg:block">
          <FilterSidebar
            items={items}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </aside>

        {/* PRODUITS */}
        <section className="space-y-4">
          <p className="text-sm text-gray-500">
            {filteredItems.length} offre{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
          </p>

          {filteredItems.length > 0 ? (
            <ProductGrid
              items={filteredItems}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune offre trouvée.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('tout');
                  setPriceRange([0, 1000000]);
                }}
                className="mt-3 text-sm text-[#E86C00] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Publicité inline */}
          {filteredItems.length > 0 && (
            <AdBanner variant="inline" adId="shop-bottom-ad" />
          )}
        </section>
      </section>
    </main>
  );
}