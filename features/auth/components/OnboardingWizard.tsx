'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '../hooks/use-onboarding';
import {
  GABON_REGIONS,
  CROPS,
  PRODUCT_CATEGORIES,
  type OnboardingRole,
} from '../schemas/onboarding.schema';

const ROLES = [
  { id: 'producer', title: 'Producteur Agricole', icon: '🌾', description: 'Je cultive et vends mes produits' },
  { id: 'cooperative', title: 'Coopérative Agricole', icon: '🤝', description: 'Je représente un groupe' },
  { id: 'buyer', title: 'Acheteur', icon: '🛒', description: 'Je cherche des produits' },
  { id: 'supplier', title: 'Fournisseur', icon: '🏭', description: "Je vends des intrants" },
  { id: 'advisor', title: 'Conseiller Agricole', icon: '📋', description: 'Je fournis des conseils' },
] as const;

const TOTAL_STEPS = 4;

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { submit, loading } = useOnboarding();

  const [form, setForm] = useState({
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    region: '',
    department: '',
    city: '',
    address: '',
    role: 'producer' as OnboardingRole,
    farm_name: '',
    farm_size: '',
    main_crops: [] as string[],
    farming_experience: '',
    cooperative_name: '',
    number_of_members: '',
    cooperative_registration: '',
    company_name: '',
    business_type: '',
    purchase_capacity: '',
    supplier_company: '',
    product_categories: [] as string[],
    supplier_license: '',
    specialization: '',
    certifications: '',
    years_of_experience: '',
  });

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleArray = (field: 'main_crops' | 'product_categories', value: string) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const next = () => {
    setError('');
    if (step === 1 && !form.phone) return setError('Téléphone requis');
    if (step === 2 && !form.region) return setError('Région requise');
    if (step === 2 && !form.city) return setError('Ville requise');
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo(0, 0);
  };

  const prev = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await submit({
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender,
        region: form.region,
        department: form.department || undefined,
        city: form.city,
        address: form.address || undefined,
        role: form.role,
        farm_name: form.farm_name || undefined,
        farm_size: form.farm_size ? parseFloat(form.farm_size) : undefined,
        main_crops: form.main_crops,
        farming_experience: form.farming_experience ? parseInt(form.farming_experience) : undefined,
        cooperative_name: form.cooperative_name || undefined,
        number_of_members: form.number_of_members ? parseInt(form.number_of_members) : undefined,
        cooperative_registration: form.cooperative_registration || undefined,
        company_name: form.company_name || undefined,
        business_type: form.business_type || undefined,
        purchase_capacity: form.purchase_capacity || undefined,
        supplier_company: form.supplier_company || undefined,
        product_categories: form.product_categories,
        supplier_license: form.supplier_license || undefined,
        specialization: form.specialization || undefined,
        certifications: form.certifications
          ? form.certifications.split(',').map((s) => s.trim())
          : [],
        years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience) : undefined,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur AFANE</h1>
        <p className="mt-2 text-gray-600">
          Complétons votre profil pour personnaliser votre expérience
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Étape {step} sur {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#E86C00] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+241 XX XX XX XX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              >
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Localisation</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région *
              </label>
              <select
                value={form.region}
                onChange={(e) => update('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              >
                <option value="">Sélectionner une région</option>
                {GABON_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville / Village *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse détaillée (optionnel)
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Choisissez votre rôle</h2>
            <div className="grid grid-cols-1 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => update('role', role.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    form.role === role.id
                      ? 'border-[#E86C00] bg-[#E86C00]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{role.icon}</span>
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

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Informations complémentaires</h2>
            <p className="text-gray-600">
              {ROLES.find((r) => r.id === form.role)?.title}
            </p>

            {form.role === 'producer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'exploitation
                  </label>
                  <input
                    type="text"
                    value={form.farm_name}
                    onChange={(e) => update('farm_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille (hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.farm_size}
                    onChange={(e) => update('farm_size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultures principales
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CROPS.map((crop) => (
                      <label key={crop} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.main_crops.includes(crop)}
                          onChange={() => toggleArray('main_crops', crop)}
                          className="rounded border-gray-300 text-[#E86C00]"
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
                    value={form.farming_experience}
                    onChange={(e) => update('farming_experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
              </>
            )}

            {form.role === 'cooperative' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la coopérative
                  </label>
                  <input
                    type="text"
                    value={form.cooperative_name}
                    onChange={(e) => update('cooperative_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de membres
                  </label>
                  <input
                    type="number"
                    value={form.number_of_members}
                    onChange={(e) => update('number_of_members', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro d'enregistrement
                  </label>
                  <input
                    type="text"
                    value={form.cooperative_registration}
                    onChange={(e) => update('cooperative_registration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
              </>
            )}

            {form.role === 'buyer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={form.company_name}
                    onChange={(e) => update('company_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de commerce
                  </label>
                  <select
                    value={form.business_type}
                    onChange={(e) => update('business_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
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
                    value={form.purchase_capacity}
                    onChange={(e) => update('purchase_capacity', e.target.value)}
                    placeholder="Ex: 10 tonnes/mois"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
              </>
            )}

            {form.role === 'supplier' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={form.supplier_company}
                    onChange={(e) => update('supplier_company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégories de produits
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.product_categories.includes(cat)}
                          onChange={() => toggleArray('product_categories', cat)}
                          className="rounded border-gray-300 text-[#E86C00]"
                        />
                        <span className="text-sm">{cat}</span>
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
                    value={form.supplier_license}
                    onChange={(e) => update('supplier_license', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
              </>
            )}

            {form.role === 'advisor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialisation
                  </label>
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) => update('specialization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <input
                    type="text"
                    value={form.certifications}
                    onChange={(e) => update('certifications', e.target.value)}
                    placeholder="Séparez par des virgules"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Années d'expérience
                  </label>
                  <input
                    type="number"
                    value={form.years_of_experience}
                    onChange={(e) => update('years_of_experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={prev} disabled={loading}>
              Précédent
            </Button>
          ) : (
            <div />
          )}
          {step < TOTAL_STEPS ? (
            <Button onClick={next} className="bg-[#E86C00] hover:bg-[#E86C00]/90">
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-[#E86C00] hover:bg-[#E86C00]/90">
              {loading ? 'Finalisation...' : "Terminer l'inscription"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
