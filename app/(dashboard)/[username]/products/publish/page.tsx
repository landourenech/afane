'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CategorySelector from '@/components/dashboard/publication/CategorySelector';
import { 
  Camera,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ImagePlus,
  Sparkles,
  DollarSign,
  Package,
  Clock,
  MapPin,
  ChevronDown,
  Users,
  ShoppingCart,
  Layers,
  TrendingDown,
} from 'lucide-react';

export default function PublishPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;
  const supabase = createClient();

  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('unité');
  const [duration, setDuration] = useState('7');
  const [mainCategory, setMainCategory] = useState('');
  const [condition, setCondition] = useState('new');
  const [location, setLocation] = useState(profile?.city || '');
  const [images, setImages] = useState<string[]>([]);
  
  // États pour la vente en gros
  const [saleType, setSaleType] = useState<'individual' | 'group'>('individual');
  const [minGroupQuantity, setMinGroupQuantity] = useState('10');
  const [maxGroupQuantity, setMaxGroupQuantity] = useState('1000');
  const [bulkDiscount, setBulkDiscount] = useState('0');
  const [minOrderQuantity, setMinOrderQuantity] = useState('1');
  const [maxOrderQuantity, setMaxOrderQuantity] = useState('');
  
  // États UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conditions = [
    { value: 'new', label: 'Neuf', icon: '✨' },
    { value: 'used', label: 'Occasion', icon: '📦' },
    { value: 'refurbished', label: 'Reconditionné', icon: '🔧' },
  ];

  const durations = [
    { value: '3', label: '3 jours' },
    { value: '7', label: '7 jours' },
    { value: '14', label: '14 jours' },
    { value: '30', label: '30 jours' },
  ];

  const units = ['unité', 'kg', 'tonne', 'sac', 'carton', 'pièce', 'litre', 'm²'];

  // Prix dégressif automatique
  const calculateBulkPrice = () => {
    if (!price || !bulkDiscount) return price;
    const basePrice = parseFloat(price);
    const discount = parseFloat(bulkDiscount);
    return (basePrice * (1 - discount / 100)).toFixed(0);
  };

  const bulkPriceCalculated = calculateBulkPrice();

  // ✅ Fonction pour sélectionner les images
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = 10 - images.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ Fonction pour supprimer une image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Analyse AI automatique
  useEffect(() => {
    const analyze = async () => {
      if (title.length < 5) return;
      
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestedCategory(data.category);
          
          if (!mainCategory && data.confidence > 0.7) {
            setMainCategory(data.category);
          }
        }
      } catch (error) {
        console.error('AI analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timer = setTimeout(analyze, 1500);
    return () => clearTimeout(timer);
  }, [title, description]);

  const handleSubmit = async () => {
    if (!profile) return;
    
    // Validation
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (images.length === 0) {
      setError('Ajoutez au moins une photo.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Le prix est requis.');
      return;
    }
    if (!mainCategory) {
      setError('Choisissez une catégorie.');
      return;
    }

    if (saleType === 'group') {
      if (!minGroupQuantity || parseInt(minGroupQuantity) < 2) {
        setError('Le minimum pour la commande groupée doit être au moins 2.');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(duration));

      const { error: pubError } = await supabase
        .from('publications')
        .insert({
          user_id: profile.id,
          title: title.trim(),
          description: description.trim(),
          images,
          price: parseFloat(price),
          quantity: parseFloat(quantity),
          unit,
          condition,
          duration_days: parseInt(duration),
          main_category: mainCategory,
          location: location || profile.city || profile.region,
          status: 'active',
          expires_at: expiresAt.toISOString(),
          
          sale_type: saleType,
          min_group_quantity: saleType === 'group' ? parseInt(minGroupQuantity) : null,
          max_group_quantity: saleType === 'group' ? parseInt(maxGroupQuantity) : null,
          group_price: saleType === 'group' ? parseFloat(bulkPriceCalculated || price) : null,
          bulk_discount: saleType === 'group' ? parseFloat(bulkDiscount) : 0,
          min_order_quantity: parseInt(minOrderQuantity) || 1,
          max_order_quantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : null,
        });

      if (pubError) throw pubError;

      setSuccess('Offre publiée avec succès !');
      setTimeout(() => {
        router.push(`/${username}`);
      }, 1500);
    } catch (error) {
      console.error('Erreur publication:', error);
      setError('Erreur lors de la publication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Créer une annonce</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Publiez votre offre en quelques étapes simples
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* SECTION : TYPE DE VENTE */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Type de vente</h2>
              <p className="text-sm text-gray-500">Choisissez comment vous voulez vendre</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSaleType('individual')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    saleType === 'individual'
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">Vente individuelle</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Vendez à l'unité ou en petite quantité
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSaleType('group')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    saleType === 'group'
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">Vente en groupe</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Vendez en gros avec commandes groupées
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {saleType === 'group' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg space-y-4">
                  <h4 className="font-medium text-green-800 flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Configuration de la vente groupée
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité minimale *
                      </label>
                      <input
                        type="number"
                        value={minGroupQuantity}
                        onChange={(e) => setMinGroupQuantity(e.target.value)}
                        placeholder="10"
                        min="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité maximale
                      </label>
                      <input
                        type="number"
                        value={maxGroupQuantity}
                        onChange={(e) => setMaxGroupQuantity(e.target.value)}
                        placeholder="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remise groupée (%)
                      </label>
                      <input
                        type="number"
                        value={bulkDiscount}
                        onChange={(e) => setBulkDiscount(e.target.value)}
                        placeholder="10"
                        min="0"
                        max="90"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix de groupe (auto)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={bulkPriceCalculated}
                          disabled
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION : PHOTOS */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Photos</h2>
              <p className="text-sm text-gray-500">Ajoutez jusqu'à 10 photos</p>
            </div>
            
            <div className="p-4">
              {images.length === 0 ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors"
                >
                  <Camera className="h-12 w-12 mb-2" />
                  <span className="font-medium">Ajouter des photos</span>
                  <span className="text-sm mt-1">ou glisser-déposer ici</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--color-secondary)] text-white text-xs rounded-full">
                          Principale
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 10 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors"
                    >
                      <ImagePlus className="h-6 w-6 mb-1" />
                      <span className="text-xs">Ajouter</span>
                    </button>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* SECTION : TITRE */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Titre</h2>
            </div>
            
            <div className="p-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Manioc frais - Récolte du jour"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{title.length}/100 caractères</span>
                {isAnalyzing && (
                  <span className="text-xs text-blue-500 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                    Analyse...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION : DESCRIPTION */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Description</h2>
            </div>
            
            <div className="p-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre produit : qualité, origine, disponibilité..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] min-h-[120px]"
                maxLength={1000}
              />
              <div className="text-right">
                <span className="text-xs text-gray-500">{description.length}/1000</span>
              </div>
            </div>
          </div>

          {/* SECTION : CATÉGORIE */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Catégorie</h2>
            </div>
            
            <div className="p-4">
              <CategorySelector 
                selected={mainCategory} 
                onSelect={setMainCategory} 
              />
            </div>
          </div>

          {/* SECTION : PRIX ET QUANTITÉ */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Prix et quantité</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix unitaire (FCFA) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock disponible
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="100"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unité
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commande minimale
                  </label>
                  <input
                    type="number"
                    value={minOrderQuantity}
                    onChange={(e) => setMinOrderQuantity(e.target.value)}
                    placeholder="1"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commande maximale
                  </label>
                  <input
                    type="number"
                    value={maxOrderQuantity}
                    onChange={(e) => setMaxOrderQuantity(e.target.value)}
                    placeholder="Optionnel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION : OPTIONS AVANCÉES */}
          <div className="bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between"
            >
              <span className="font-semibold text-gray-900">Options avancées</span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État du produit
                  </label>
                  <div className="flex gap-2">
                    {conditions.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCondition(c.value)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                          condition === c.value
                            ? 'bg-[var(--color-secondary)] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1">{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ville ou région"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée de l'offre
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {durations.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDuration(d.value)}
                        className={`py-2 px-3 rounded-md text-sm transition-colors ${
                          duration === d.value
                            ? 'bg-[var(--color-secondary)] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOUTON PUBLIER */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-lg font-semibold shadow-md"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Publier l'annonce
          </button>
        </div>
      </div>
    </div>
  );
}