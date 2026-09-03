'use client';

import { useState } from 'react';
import { 
  Sprout, 
  Apple, 
  Beef, 
  Leaf,          // ✅ Remplacer Seedling par Leaf
  FlaskConical, 
  Tractor, 
  Home, 
  Package, 
  Fish, 
  Wrench,
  Check,
} from 'lucide-react';

const MAIN_CATEGORIES = [
  { 
    id: 'produits-agricoles', 
    label: 'Produits agricoles', 
    icon: Sprout,
    subCategories: ['Manioc', 'Maïs', 'Banane plantain', 'Arachide', 'Riz', 'Igname', 'Patate douce']
  },
  { 
    id: 'fruits-legumes', 
    label: 'Fruits et légumes', 
    icon: Apple,
    subCategories: ['Tomates', 'Oignons', 'Piments', 'Légumes feuilles', 'Ananas', 'Papaye', 'Agrumes']
  },
  { 
    id: 'betail-volaille', 
    label: 'Bétail et volaille', 
    icon: Beef,
    subCategories: ['Poulets', 'Porcs', 'Bœufs', 'Chèvres', 'Moutons', 'Œufs']
  },
  { 
    id: 'semences-plants', 
    label: 'Semences et plants', 
    icon: Leaf,  // ✅ Utiliser Leaf
    subCategories: ['Semences certifiées', 'Boutures', 'Plants greffés']
  },
  { 
    id: 'intrants', 
    label: 'Intrants agricoles', 
    icon: FlaskConical,
    subCategories: ['Engrais', 'Pesticides', 'Herbicides', 'Fongicides']
  },
  { 
    id: 'equipements', 
    label: 'Équipements', 
    icon: Tractor,
    subCategories: ['Tracteurs', 'Outils manuels', 'Irrigation', 'Stockage']
  },
  { 
    id: 'immobilier', 
    label: 'Immobilier agricole', 
    icon: Home,
    subCategories: ['Terres', 'Fermes', 'Bâtiments']
  },
  { 
    id: 'produits-transformes', 
    label: 'Produits transformés', 
    icon: Package,
    subCategories: ['Farine', 'Huile', 'Jus', 'Conserves']
  },
  { 
    id: 'peche', 
    label: 'Produits de la pêche', 
    icon: Fish,
    subCategories: ['Poissons frais', 'Poissons fumés', 'Crevettes']
  },
  { 
    id: 'services', 
    label: 'Services agricoles', 
    icon: Wrench,
    subCategories: ['Labour', 'Conseil', 'Transport', 'Transformation']
  },
];

interface CategorySelectorProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const selectedCategory = MAIN_CATEGORIES.find(c => c.id === selected);

  const handleCategoryClick = (categoryId: string) => {
    onSelect(categoryId);
    setShowSubCategories(true);
    setSelectedSubCategory('');
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <div>
      {/* Grille des catégories principales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {MAIN_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Icon 
                  className={`h-6 w-6 mb-1.5 ${
                    isSelected ? 'text-[var(--color-secondary)]' : 'text-gray-500'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium leading-tight ${
                    isSelected ? 'text-[var(--color-secondary)]' : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </span>
                {isSelected && (
                  <span className="mt-1.5 p-0.5 bg-[var(--color-secondary)] text-white rounded-full">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sous-catégories */}
      {selectedCategory && showSubCategories && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Préciser</span> (optionnel) - {selectedCategory.label} :
            </p>
            <button
              onClick={() => setShowSubCategories(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Masquer
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedCategory.subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategoryClick(sub)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedSubCategory === sub
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {sub}
              </button>
            ))}
            <button
              onClick={() => handleSubCategoryClick('autre')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedSubCategory === 'autre'
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-white text-gray-400 border border-dashed border-gray-300 hover:bg-gray-100'
              }`}
            >
              + Autre
            </button>
          </div>

          {selectedSubCategory === 'autre' && (
            <input
              type="text"
              placeholder="Précisez..."
              className="mt-2 w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          )}
        </div>
      )}

      {/* Indicateur de sélection */}
      {selected && (
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Check className="h-4 w-4 text-[var(--color-secondary)] mr-1" />
          Catégorie sélectionnée : 
          <span className="font-medium text-gray-700 ml-1">
            {selectedCategory?.label}
            {selectedSubCategory && selectedSubCategory !== 'autre' ? ` - ${selectedSubCategory}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}       