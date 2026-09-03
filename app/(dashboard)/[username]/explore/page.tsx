'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  ShoppingCart, 
  X, 
  Filter,
  Package,
  TrendingUp,
  Sparkles,
  Heart,
  Eye,
  Star,
} from 'lucide-react';
import { AdBanner } from '@/components/shop/AdBanner';
import { SearchBar } from '@/components/shop/SearchBar';
import { CategoryTabs } from '@/components/shop/CategoryTabs';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartButton } from '@/components/shop/CartButton';

// Types
interface Publication {
  id: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  main_category: string;
  sale_type: 'individual' | 'group';
  status: 'active' | 'expired' | 'sold' | 'cancelled';
  views_count: number;
  images?: string[];
  location?: string;
  created_at: string;
  seller?: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
}

export default function ShopPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  // États
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [priceRange, setPriceRange] = useState<readonly number[]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Charger les publications actives
  const loadPublications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/publications?status=active&limit=50');
      if (response.ok) {
        const data = await response.json();
        const pubs: Publication[] = data.publications || [];
        setPublications(pubs);
        setFilteredPublications(pubs);
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

  // Popup publicitaire après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrer
  useEffect(() => {
    const filtered = publications.filter((pub) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        pub.title.toLowerCase().includes(query) ||
        (pub.description || '').toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'tout' || pub.main_category === selectedCategory;
      const price = Number(pub.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
    setFilteredPublications(filtered);
  }, [publications, searchQuery, selectedCategory, priceRange]);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('tout');
    publications.forEach(pub => cats.add(pub.main_category));
    return Array.from(cats);
  }, [publications]);

  const handleAddToCart = (pub: Publication) => {
    setCartCount(prev => prev + 1);
    // Ici, vous pouvez ajouter la logique de panier
  };

  const handleToggleFavorite = (pubId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(pubId)) {
        newFavorites.delete(pubId);
      } else {
        newFavorites.add(pubId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* POP-UP PUBLICITAIRE */}
      {showPopup && <AdBanner variant="popup" adId="shop-welcome-popup" />}

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Boutique</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredPublications.length} offre{filteredPublications.length > 1 ? 's' : ''} disponible{filteredPublications.length > 1 ? 's' : ''}
            </p>
          </div>
          <CartButton count={cartCount} />
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* BANNIÈRE PUBLICITAIRE */}
        <AdBanner variant="banner" adId="shop-top-banner" className="mb-6" />

        {/* RECHERCHE */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher un produit, un équipement, un service..."
            className="w-full"
          />
        </div>

        {/* CATÉGORIES */}
        <div className="mb-6">
          <CategoryTabs
            items={publications.map(p => ({ category: p.main_category }))}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          />
        </div>

        {/* FILTRES MOBILE */}
        <div className="lg:hidden mb-4">
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
                className="w-full accent-[var(--color-secondary)]"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0 FCFA</span>
                <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* FILTRES DESKTOP */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24 space-y-4">
              <h3 className="font-semibold text-gray-900">Filtres</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Prix maximum</p>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[var(--color-secondary)]"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0</span>
                  <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
          </aside>

          {/* GRILLE DE PRODUITS */}
          <section className="space-y-4">
            {filteredPublications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPublications.map((pub, index) => (
                  <div key={pub.id} className="contents">
                    {/* Publicité inline après 6 produits */}
                    {index === 5 && (
                      <div className="col-span-full">
                        <AdBanner variant="inline" adId={`shop-inline-ad-${index}`} />
                      </div>
                    )}
                    
                    {/* CARTE PRODUIT */}
                    <Link
                      href={`/${username}/shop/${pub.id}`}
                      className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
                    >
                      {/* IMAGE */}
                      <div className="relative h-44 bg-gray-200 overflow-hidden">
                        {pub.images && pub.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pub.images[0]}
                            alt={pub.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-300" />
                          </div>
                        )}

                        {/* Badge type */}
                        <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-full text-xs font-semibold shadow-sm">
                          {pub.sale_type === 'group' ? '👥 Groupe' : '🛒 Individuel'}
                        </span>

                        {/* Bouton favori */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleFavorite(pub.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm transition-colors hover:bg-red-50"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favorites.has(pub.id) 
                                ? 'text-red-500 fill-red-500' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </button>
                      </div>

                      {/* INFORMATIONS */}
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {pub.title}
                        </h3>
                        
                        <p className="text-xs text-gray-500 mt-0.5">
                          {pub.main_category}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-lg font-bold text-[var(--color-secondary)]">
                            {pub.price.toLocaleString('fr-FR')} FCFA
                          </p>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pub.views_count || 0}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {pub.quantity} {pub.unit}
                          </p>
                          {pub.location && (
                            <span className="text-xs text-gray-400">{pub.location}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Aucune offre trouvée.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('tout');
                    setPriceRange([0, 1000000]);
                  }}
                  className="mt-3 text-sm text-[var(--color-secondary)] hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Publicité inline en bas */}
            {filteredPublications.length > 0 && (
              <AdBanner variant="inline" adId="shop-bottom-ad" />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}