'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Filter, 
  X, 
  Layers, 
  Sprout,
  TrendingUp,
  Users,
  Package,
  ChevronRight,
  Navigation,
  Maximize2,
  Info,
} from 'lucide-react';

// Import dynamique de la carte (évite les erreurs SSR)
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00]"></div>
    </div>
  ),
});

// Types
interface Farm {
  id: string;
  name: string;
  owner_name: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  main_crops: string[];
  area_hectares?: number;
  production_type: 'producer' | 'cooperative';
  verified: boolean;
}

// Régions du Gabon
const REGIONS = [
  'Tout le Gabon',
  'Estuaire',
  'Haut-Ogooué',
  'Moyen-Ogooué',
  'Ngounié',
  'Nyanga',
  'Ogooué-Ivindo',
  'Ogooué-Lolo',
  'Ogooué-Maritime',
  'Woleu-Ntem',
];

// Cultures
const CROPS = [
  'Toutes les cultures',
  'Manioc',
  'Maïs',
  'Banane plantain',
  'Arachide',
  'Riz',
  'Igname',
  'Cacao',
  'Café',
  'Palmier à huile',
];

export default function CartePage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tout le Gabon');
  const [selectedCrop, setSelectedCrop] = useState('Toutes les cultures');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStats, setShowStats] = useState(true);

  // Charger les exploitations
  useEffect(() => {
    const loadFarms = async () => {
      try {
        const response = await fetch('/api/farms');
        if (response.ok) {
          const data = await response.json();
          setFarms(data.farms || []);
        }
      } catch (error) {
        console.error('Erreur chargement fermes:', error);
        // Données de démo en cas d'erreur
        setFarms([
          {
            id: '1',
            name: 'Ferme Espoir',
            owner_name: 'Jean Dupont',
            region: 'Estuaire',
            city: 'Libreville',
            latitude: 0.3901,
            longitude: 9.4544,
            main_crops: ['Manioc', 'Maïs', 'Banane plantain'],
            area_hectares: 5.5,
            production_type: 'producer',
            verified: true,
          },
          {
            id: '2',
            name: 'Coopérative Agricole du Nord',
            owner_name: 'Marie Nzuzi',
            region: 'Woleu-Ntem',
            city: 'Oyem',
            latitude: 1.5993,
            longitude: 11.5793,
            main_crops: ['Cacao', 'Café'],
            area_hectares: 25,
            production_type: 'cooperative',
            verified: true,
          },
          {
            id: '3',
            name: 'Ferme Les Palmiers',
            owner_name: 'Pierre Mba',
            region: 'Ogooué-Maritime',
            city: 'Port-Gentil',
            latitude: -0.7193,
            longitude: 8.7815,
            main_crops: ['Palmier à huile', 'Manioc'],
            area_hectares: 15,
            production_type: 'producer',
            verified: false,
          },
          {
            id: '4',
            name: 'Ferme du Sud',
            owner_name: 'Rose Obame',
            region: 'Nyanga',
            city: 'Tchibanga',
            latitude: -2.9333,
            longitude: 11.0167,
            main_crops: ['Riz', 'Arachide'],
            area_hectares: 8,
            production_type: 'producer',
            verified: true,
          },
          {
            id: '5',
            name: 'Coopérative Haut-Ogooué',
            owner_name: 'Paul Lekogo',
            region: 'Haut-Ogooué',
            city: 'Franceville',
            latitude: -1.6333,
            longitude: 13.5833,
            main_crops: ['Maïs', 'Manioc', 'Igname'],
            area_hectares: 30,
            production_type: 'cooperative',
            verified: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFarms();
  }, []);

  // Filtrer les fermes
  const filteredFarms = useMemo(() => {
    return farms.filter((farm) => {
      const matchesSearch = 
        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = 
        selectedRegion === 'Tout le Gabon' || 
        farm.region === selectedRegion;
      
      const matchesCrop = 
        selectedCrop === 'Toutes les cultures' || 
        farm.main_crops.includes(selectedCrop);
      
      return matchesSearch && matchesRegion && matchesCrop;
    });
  }, [farms, searchQuery, selectedRegion, selectedCrop]);

  // Statistiques
  const stats = useMemo(() => ({
    total: filteredFarms.length,
    producers: filteredFarms.filter(f => f.production_type === 'producer').length,
    cooperatives: filteredFarms.filter(f => f.production_type === 'cooperative').length,
    totalArea: filteredFarms.reduce((sum, f) => sum + (f.area_hectares || 0), 0),
  }), [filteredFarms]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
     

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        {showSidebar && (
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Recherche */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Filtres */}
              <div className="mt-3 space-y-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                >
                  {REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                >
                  {CROPS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statistiques */}
            {showStats && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Statistiques
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">Surface</p>
                    <p className="text-lg font-bold text-gray-900">{stats.totalArea}ha</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">🌾 Producteurs</p>
                    <p className="text-lg font-bold text-[#E86C00]">{stats.producers}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">🤝 Coopératives</p>
                    <p className="text-lg font-bold text-[#0C4428]">{stats.cooperatives}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des fermes */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 border-b border-gray-200 bg-white sticky top-0">
                <p className="text-xs text-gray-500">
                  {filteredFarms.length} exploitation{filteredFarms.length > 1 ? 's' : ''}
                </p>
              </div>

              {filteredFarms.length === 0 ? (
                <div className="p-8 text-center">
                  <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucune exploitation trouvée</p>
                </div>
              ) : (
                filteredFarms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => setSelectedFarm(farm)}
                    className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedFarm?.id === farm.id ? 'bg-[#E86C00]/5 border-l-4 border-l-[#E86C00]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`p-1.5 rounded-full flex-shrink-0 ${
                        farm.production_type === 'cooperative' 
                          ? 'bg-[#0C4428]/10 text-[#0C4428]' 
                          : 'bg-[#E86C00]/10 text-[#E86C00]'
                      }`}>
                        {farm.production_type === 'cooperative' 
                          ? <Users className="h-3.5 w-3.5" />
                          : <Sprout className="h-3.5 w-3.5" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {farm.name}
                          </p>
                          {farm.verified && (
                            <span className="text-blue-500 text-xs">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {farm.city}, {farm.region}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {farm.main_crops.slice(0, 2).map(crop => (
                            <span
                              key={crop}
                              className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>
        )}

        {/* CARTE */}
        <div className="flex-1 relative">
          {/* Bouton toggle sidebar */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title={showSidebar ? 'Masquer la sidebar' : 'Afficher la sidebar'}
          >
            <Layers className="h-5 w-5 text-gray-600" />
          </button>

          {/* Légende */}
          <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-md p-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Légende</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-[#E86C00]"></div>
                <span className="text-gray-600">Producteur</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-[#0C4428]"></div>
                <span className="text-gray-600">Coopérative</span>
              </div>
            </div>
          </div>

          {/* Carte */}
            <MapComponent
            farms={filteredFarms}
            selectedFarm={selectedFarm}
            onFarmSelect={setSelectedFarm}
            selectedRegion={selectedRegion}  // ✅ Passer la région
            />

          {/* Panneau détail */}
          {selectedFarm && (
            <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0C4428] to-[#E86C00] p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {selectedFarm.production_type === 'cooperative' ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      <Sprout className="h-5 w-5" />
                    )}
                    <div>
                      <h3 className="font-semibold">{selectedFarm.name}</h3>
                      <p className="text-xs opacity-90">
                        {selectedFarm.production_type === 'cooperative' 
                          ? 'Coopérative' 
                          : 'Producteur'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFarm(null)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {selectedFarm.city}, {selectedFarm.region}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{selectedFarm.owner_name}</span>
                </div>

                {selectedFarm.area_hectares && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {selectedFarm.area_hectares} hectares
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Cultures principales</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedFarm.main_crops.map(crop => (
                      <span
                        key={crop}
                        className="text-xs px-2 py-1 bg-[#E86C00]/10 text-[#E86C00] rounded-full"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/boutique?region=${selectedFarm.region}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-[#E86C00] text-white rounded-md hover:opacity-90 text-sm font-medium"
                >
                  Voir les produits
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}