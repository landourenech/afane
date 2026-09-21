import { z } from 'zod';

export const ONBOARDING_ROLES = [
  'producer',
  'cooperative',
  'buyer',
  'supplier',
  'advisor',
] as const;

export type OnboardingRole = (typeof ONBOARDING_ROLES)[number];

export const GABON_REGIONS = [
  'Estuaire',
  'Haut-Ogooué',
  'Moyen-Ogooué',
  'Ngounié',
  'Nyanga',
  'Ogooué-Ivindo',
  'Ogooué-Lolo',
  'Ogooué-Maritime',
  'Woleu-Ntem',
] as const;

export const CROPS = [
  'Maïs', 'Manioc', 'Banane plantain', 'Arachide', 'Riz',
  'Igname', 'Patate douce', 'Taro', 'Légumes', 'Fruits',
  'Cacao', 'Café', 'Palmier à huile', 'Autres',
] as const;

export const PRODUCT_CATEGORIES = [
  'Engrais', 'Semences', 'Produits phytosanitaires',
  'Équipements agricoles', 'Outillage', 'Irrigation', 'Autres',
] as const;

export const onboardingSchema = z.object({
  phone: z.string().min(8, 'Téléphone requis'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).default('male'),
  region: z.string().min(1, 'Région requise'),
  department: z.string().optional(),
  city: z.string().min(1, 'Ville requise'),
  address: z.string().optional(),
  role: z.enum(ONBOARDING_ROLES),
  farm_name: z.string().optional(),
  farm_size: z.number().optional(),
  main_crops: z.array(z.string()).default([]),
  farming_experience: z.number().optional(),
  cooperative_name: z.string().optional(),
  number_of_members: z.number().optional(),
  cooperative_registration: z.string().optional(),
  company_name: z.string().optional(),
  business_type: z.string().optional(),
  purchase_capacity: z.string().optional(),
  supplier_company: z.string().optional(),
  product_categories: z.array(z.string()).default([]),
  supplier_license: z.string().optional(),
  specialization: z.string().optional(),
  certifications: z.array(z.string()).default([]),
  years_of_experience: z.number().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
