'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Types
type OnboardingRole = 'producer' | 'cooperative' | 'buyer' | 'supplier' | 'advisor';

interface FormData {
  phone: string;
  dateOfBirth: string;
  gender: string;
  region: string;
  department: string;
  city: string;
  address: string;
  role: OnboardingRole;
  farm_name: string;
  farm_size: string;
  main_crops: string[];
  farming_experience: string;
  cooperative_name: string;
  number_of_members: string;
  cooperative_registration: string;
  company_name: string;
  business_type: string;
  purchase_capacity: string;
  supplier_company: string;
  product_categories: string[];
  supplier_license: string;
  specialization: string;
  certifications: string;
  years_of_experience: string;
}

const REGIONS = [
  'Estuaire',
  'Haut-Ogooué',
  'Moyen-Ogooué',
  'Ngounié',
  'Nyanga',
  'Ogooué-Ivindo',
  'Ogooué-Lolo',
  'Ogooué-Maritime',
  'Woleu-Ntem'
];

const ROLES = [
  { id: 'producer', title: 'Producteur Agricole', icon: '🌾', description: 'Je cultive et je vends mes produits' },
  { id: 'cooperative', title: 'Coopérative Agricole', icon: '🤝', description: 'Je représente un groupe de producteurs' },
  { id: 'buyer', title: 'Acheteur', icon: '🛒', description: 'Je cherche des produits agricoles' },
  { id: 'supplier', title: 'Fournisseur d\'Intrants', icon: '🏭', description: 'Je vends des intrants agricoles' },
  { id: 'advisor', title: 'Conseiller Agricole', icon: '📋', description: 'Je fournis des conseils techniques' }
];

const CROPS = ['Maïs', 'Manioc', 'Banane plantain', 'Arachide', 'Riz', 'Igname', 'Patate douce', 'Taro', 'Légumes', 'Fruits', 'Cacao', 'Café', 'Palmier à huile', 'Autres'];

const PRODUCT_CATEGORIES = ['Engrais', 'Semences', 'Produits phytosanitaires', 'Équipements agricoles', 'Outillage', 'Irrigation', 'Autres'];

export default function OnboardingPage() {
  const { user, profile, completeOnboarding } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    region: '',
    department: '',
    city: '',
    address: '',
    role: 'producer',
    farm_name: '',
    farm_size: '',
    main_crops: [],
    farming_experience: '',
    cooperative_name: '',
    number_of_members: '',
    cooperative_registration: '',
    company_name: '',
    business_type: '',
    purchase_capacity: '',
    supplier_company: '',
    product_categories: [],
    supplier_license: '',
    specialization: '',
    certifications: '',
    years_of_experience: '',
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayField = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1 && !formData.phone) {
      setError('Le numéro de téléphone est requis');
      return;
    }
    if (step === 2 && !formData.region) {
      setError('La région est requise');
      return;
    }
    if (step === 2 && !formData.city) {
      setError('La ville est requise');
      return;
    }
    
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setError('');
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Construire les données à envoyer
      const dataToSend: any = {
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        region: formData.region,
        department: formData.department,
        city: formData.city,
        address: formData.address,
        role: formData.role,
      };

      // Ajouter les champs spécifiques selon le rôle
      if (formData.role === 'producer') {
        dataToSend.farm_name = formData.farm_name || null;
        dataToSend.farm_size = formData.farm_size ? parseFloat(formData.farm_size) : null;
        dataToSend.main_crops = formData.main_crops;
        dataToSend.farming_experience = formData.farming_experience ? parseInt(formData.farming_experience) : null;
      } else if (formData.role === 'cooperative') {
        dataToSend.cooperative_name = formData.cooperative_name || null;
        dataToSend.number_of_members = formData.number_of_members ? parseInt(formData.number_of_members) : null;
        dataToSend.cooperative_registration = formData.cooperative_registration || null;
      } else if (formData.role === 'buyer') {
        dataToSend.company_name = formData.company_name || null;
        dataToSend.business_type = formData.business_type || null;
        dataToSend.purchase_capacity = formData.purchase_capacity || null;
      } else if (formData.role === 'supplier') {
        dataToSend.supplier_company = formData.supplier_company || null;
        dataToSend.product_categories = formData.product_categories;
        dataToSend.supplier_license = formData.supplier_license || null;
      } else if (formData.role === 'advisor') {
        dataToSend.specialization = formData.specialization || null;
        dataToSend.certifications = formData.certifications ? formData.certifications.split(',').map(s => s.trim()) : null;
        dataToSend.years_of_experience = formData.years_of_experience ? parseInt(formData.years_of_experience) : null;
      }

      console.log('Submitting onboarding data:', dataToSend);
      
      await completeOnboarding(dataToSend);
      
      // La redirection est gérée dans completeOnboarding
    } catch (err) {
      console.error('Error submitting:', err);
      setError('Erreur lors de la finalisation. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur Kimba Connect</h1>
          <p className="mt-2 text-gray-600">Complétons votre profil pour personnaliser votre expérience</p>
          <p className="mt-1 text-sm text-gray-500">
            Connecté en tant que : {user.email}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Étape {step} sur 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white shadow rounded-lg p-6">
          {/* Étape 1 : Informations personnelles */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+241 XX XX XX XX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
          )}

          {/* Étape 2 : Localisation */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Localisation</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => updateField('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionner une région</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville / Village *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse détaillée (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* Étape 3 : Choix du rôle */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Choisissez votre rôle</h2>
              <p className="text-gray-600">Sélectionnez le profil qui correspond le mieux à votre activité</p>
              
              <div className="grid grid-cols-1 gap-4">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => updateField('role', role.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.role === role.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{role.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{role.title}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 4 : Informations spécifiques */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Informations complémentaires
              </h2>
              <p className="text-gray-600">
                {ROLES.find(r => r.id === formData.role)?.title}
              </p>

              {/* Producteur */}
              {formData.role === 'producer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'exploitation
                    </label>
                    <input
                      type="text"
                      value={formData.farm_name}
                      onChange={(e) => updateField('farm_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille (hectares)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.farm_size}
                      onChange={(e) => updateField('farm_size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cultures principales
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CROPS.map(crop => (
                        <label key={crop} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.main_crops.includes(crop)}
                            onChange={() => toggleArrayField('main_crops', crop)}
                            className="rounded border-gray-300 text-green-600"
                          />
                          <span className="text-sm">{crop}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      value={formData.farming_experience}
                      onChange={(e) => updateField('farming_experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              {/* Coopérative */}
              {formData.role === 'cooperative' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la coopérative
                    </label>
                    <input
                      type="text"
                      value={formData.cooperative_name}
                      onChange={(e) => updateField('cooperative_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de membres
                    </label>
                    <input
                      type="number"
                      value={formData.number_of_members}
                      onChange={(e) => updateField('number_of_members', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro d'enregistrement
                    </label>
                    <input
                      type="text"
                      value={formData.cooperative_registration}
                      onChange={(e) => updateField('cooperative_registration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              {/* Acheteur */}
              {formData.role === 'buyer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => updateField('company_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de commerce
                    </label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => updateField('business_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="grossiste">Grossiste</option>
                      <option value="détaillant">Détaillant</option>
                      <option value="transformateur">Transformateur</option>
                      <option value="exportateur">Exportateur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacité d'achat
                    </label>
                    <input
                      type="text"
                      value={formData.purchase_capacity}
                      onChange={(e) => updateField('purchase_capacity', e.target.value)}
                      placeholder="Ex: 10 tonnes/mois"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              {/* Fournisseur */}
              {formData.role === 'supplier' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.supplier_company}
                      onChange={(e) => updateField('supplier_company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégories de produits
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_CATEGORIES.map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.product_categories.includes(category)}
                            onChange={() => toggleArrayField('product_categories', category)}
                            className="rounded border-gray-300 text-green-600"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de licence
                    </label>
                    <input
                      type="text"
                      value={formData.supplier_license}
                      onChange={(e) => updateField('supplier_license', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              {/* Conseiller */}
              {formData.role === 'advisor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spécialisation
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => updateField('specialization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={(e) => updateField('certifications', e.target.value)}
                      placeholder="Séparez par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      value={formData.years_of_experience}
                      onChange={(e) => updateField('years_of_experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Précédent
              </button>
            ) : (
              <div />
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Finalisation...' : 'Terminer l\'inscription'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}