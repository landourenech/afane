'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapComponentProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onFarmSelect: (farm: Farm | null) => void;
  selectedRegion?: string;  // ✅ Nouvelle prop
}

// ✅ Limites du Gabon
const GABON_BOUNDS: L.LatLngBoundsExpression = [
  [-4.0, 8.5],
  [2.5, 14.5],
];

const GABON_CENTER: [number, number] = [-0.8037, 11.6094];

// ✅ Correspondance entre les noms de régions et les propriétés du GeoJSON
const REGION_MAPPING: Record<string, string[]> = {
  'Estuaire': ['Estuaire'],
  'Haut-Ogooué': ['Haut-Ogooué', 'Haut Ogooué'],
  'Moyen-Ogooué': ['Moyen-Ogooué', 'Moyen Ogooué'],
  'Ngounié': ['Ngounié', 'Ngounie'],
  'Nyanga': ['Nyanga'],
  'Ogooué-Ivindo': ['Ogooué-Ivindo', 'Ogooue-Ivindo'],
  'Ogooué-Lolo': ['Ogooué-Lolo', 'Ogooue-Lolo'],
  'Ogooué-Maritime': ['Ogooué-Maritime', 'Ogooue-Maritime'],
  'Woleu-Ntem': ['Woleu-Ntem', 'Woleu Ntem'],
};

// ✅ Icône personnalisée
const createCustomIcon = (type: 'producer' | 'cooperative') => {
  const color = type === 'cooperative' ? '#0C4428' : '#E86C00';
  const emoji = type === 'cooperative' ? '🤝' : '🌾';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// ✅ Composant pour verrouiller la carte et zoomer sur la région
function MapController({ 
  selectedFarm, 
  selectedRegion, 
  regionBounds 
}: { 
  selectedFarm: Farm | null; 
  selectedRegion?: string;
  regionBounds?: L.LatLngBounds | null;
}) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(GABON_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;

    // Si une ferme est sélectionnée
    if (selectedFarm) {
      map.flyTo([selectedFarm.latitude, selectedFarm.longitude], 10, {
        duration: 1.5,
      });
      return;
    }

    // ✅ Si une région est sélectionnée, zoomer dessus
    if (selectedRegion && selectedRegion !== 'Tout le Gabon' && regionBounds) {
      map.flyToBounds(regionBounds, {
        duration: 1.5,
        padding: [50, 50],
      });
      return;
    }

    // ✅ Sinon, revenir à la vue du Gabon entier
    if (selectedRegion === 'Tout le Gabon') {
      map.flyTo(GABON_CENTER, 7, { duration: 1 });
    }
  }, [selectedFarm, selectedRegion, regionBounds, map]);

  return null;
}

export default function MapComponent({
  farms,
  selectedFarm,
  onFarmSelect,
  selectedRegion = 'Tout le Gabon',
}: MapComponentProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [regionBounds, setRegionBounds] = useState<L.LatLngBounds | null>(null);
  const [activeRegionName, setActiveRegionName] = useState<string | null>(null);

  // ✅ Charger le GeoJSON des régions
  useEffect(() => {
    fetch('/geo/gadm41_GAB_2.json')
      .then(res => res.json())
      .then(data => {
        console.log('GeoJSON chargé:', data);
        setGeoData(data);
      })
      .catch(err => console.error('Erreur chargement GeoJSON:', err));
  }, []);

  // ✅ Calculer la région active
  useEffect(() => {
    if (!selectedRegion || selectedRegion === 'Tout le Gabon' || !geoData) {
      setActiveRegionName(null);
      setRegionBounds(null);
      return;
    }

    const possibleNames = REGION_MAPPING[selectedRegion] || [selectedRegion];
    const found = possibleNames.find(name => {
      return geoData.features?.some((feature: any) => {
        const props = feature.properties;
        const regionName = props.NAME_1 || props.name || props.region || props.NOM || '';
        return regionName.toLowerCase().includes(name.toLowerCase());
      });
    });

    setActiveRegionName(found || selectedRegion);
  }, [selectedRegion, geoData]);

  // ✅ Style des régions
  const regionStyle = (feature: any) => {
    const props = feature.properties;
    const regionName = props.NAME_1 || props.name || props.region || props.NOM || '';
    const possibleNames = REGION_MAPPING[selectedRegion] || [selectedRegion];
    
    // ✅ Vérifier si cette région est sélectionnée
    const isSelected = selectedRegion !== 'Tout le Gabon' && 
      possibleNames.some(name => 
        regionName.toLowerCase().includes(name.toLowerCase())
      );

    if (isSelected) {
      // ✅ Région sélectionnée : border épais orange
      return {
        color: '#E86C00',       // Bordure orange
        weight: 4,              // Bordure épaisse
        opacity: 1,
        fillColor: '#E86C00',
        fillOpacity: 0.15,      // Léger remplissage
        dashArray: '',          // Trait plein
      };
    }

    // Style par défaut : discret
    return {
      color: '#0C4428',
      weight: 1,
      opacity: 0.3,
      fillColor: '#0C4428',
      fillOpacity: 0.02,
    };
  };

  // ✅ Gestionnaire pour chaque région
  const onEachRegion = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const regionName = props.NAME_1 || props.name || props.region || props.NOM || '';

    // ✅ Calculer les bounds de la région
    layer.on('click', () => {
      if (regionName === activeRegionName) return;
    });

    // ✅ Effet hover
    layer.on('mouseover', () => {
      const geoLayer = layer as L.GeoJSON;
      geoLayer.setStyle({
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.1,
      });
    });

    layer.on('mouseout', () => {
      const geoLayer = layer as L.GeoJSON;
      geoLayer.setStyle(regionStyle(feature));
    });
  };

  // ✅ Calculer les bounds de la région sélectionnée
  useEffect(() => {
    if (!geoData || !activeRegionName) {
      setRegionBounds(null);
      return;
    }

    const possibleNames = REGION_MAPPING[selectedRegion] || [selectedRegion];
    const selectedFeature = geoData.features?.find((feature: any) => {
      const props = feature.properties;
      const regionName = props.NAME_1 || props.name || props.region || props.NOM || '';
      return possibleNames.some(name => 
        regionName.toLowerCase().includes(name.toLowerCase())
      );
    });

    if (selectedFeature) {
      try {
        const bounds = L.geoJSON(selectedFeature).getBounds();
        setRegionBounds(bounds);
      } catch (err) {
        console.error('Erreur calcul bounds:', err);
      }
    }
  }, [geoData, activeRegionName, selectedRegion]);

  return (
    <MapContainer
      center={GABON_CENTER}
      zoom={7}
      minZoom={6}
      maxZoom={18}
      maxBounds={GABON_BOUNDS}
      maxBoundsViscosity={1.0}
      style={{ width: '100%', height: '100%', background: '#f8f9fa' }}
      scrollWheelZoom={true}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />

      {/* ✅ Contour du Gabon */}
      {geoData && (
        <GeoJSON
          key={`regions-${selectedRegion}`}  // ✅ Force le re-render
          data={geoData}
          style={regionStyle}
          onEachFeature={onEachRegion}
        />
      )}

      <MapController 
        selectedFarm={selectedFarm}
        selectedRegion={selectedRegion}
        regionBounds={regionBounds}
      />

      {/* ✅ Marqueurs des fermes */}
      {farms.map((farm) => (
        <Marker
          key={farm.id}
          position={[farm.latitude, farm.longitude]}
          icon={createCustomIcon(farm.production_type)}
          eventHandlers={{
            click: () => onFarmSelect(farm),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {farm.production_type === 'cooperative' ? '🤝' : '🌾'}
                </span>
                <div>
                  <h3 className="font-semibold text-sm">{farm.name}</h3>
                  <p className="text-xs text-gray-500">
                    {farm.production_type === 'cooperative' ? 'Coopérative' : 'Producteur'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600">📍 {farm.city}, {farm.region}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}