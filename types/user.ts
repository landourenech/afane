export type UserRole = 'user' | 'producer' | 'cooperative' | 'buyer' | 'supplier' | 'advisor' | 'admin';

// Type pour les rôles sélectionnables lors de l'onboarding
export type OnboardingRole = Exclude<UserRole, 'user' | 'admin'>;

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  
  // Informations de base
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  
  // Localisation
  country: string;
  region?: string;
  department?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  
  // Rôle et statut
  role: UserRole;
  onboarding_completed: boolean;
  verification_status: VerificationStatus;
  
  // Informations spécifiques selon le rôle
  farm_name?: string;
  farm_size?: number;
  main_crops?: string[];
  farming_experience?: number;
  
  cooperative_name?: string;
  number_of_members?: number;
  cooperative_registration?: string;
  
  company_name?: string;
  business_type?: string;
  purchase_capacity?: string;
  
  supplier_company?: string;
  product_categories?: string[];
  supplier_license?: string;
  
  specialization?: string;
  certifications?: string[];
  years_of_experience?: number;
  
  // Préférences
  preferred_language: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  // Timestamps
  created_at: string;
  updated_at: string;
  onboarding_completed_at?: string;
}

export interface RoleSpecificInfo {
  // Pour producteur
  farm_name?: string;
  farm_size?: number;
  main_crops?: string[];
  farming_experience?: number;
  
  // Pour coopérative
  cooperative_name?: string;
  number_of_members?: number;
  cooperative_registration?: string;
  
  // Pour acheteur
  company_name?: string;
  business_type?: string;
  purchase_capacity?: string;
  
  // Pour fournisseur
  supplier_company?: string;
  product_categories?: string[];
  supplier_license?: string;
  
  // Pour conseiller
  specialization?: string;
  certifications?: string[];
  years_of_experience?: number;
}

export interface OnboardingData {
  personalInfo: {
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
  };
  location: {
    region: string;
    department: string;
    city: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  role: OnboardingRole; // Utiliser OnboardingRole au lieu de Exclude<UserRole, 'user' | 'admin'>
  roleSpecificInfo: RoleSpecificInfo;
  preferences: {
    preferred_language: string;
    notification_preferences: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}
// Mapping des rôles pour la sidebar
export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Utilisateur',
  producer: 'Producteur',
  cooperative: 'Coopérative',
  buyer: 'Acheteur',
  supplier: 'Fournisseur',
  advisor: 'Conseiller',
  admin: 'Administrateur',
};