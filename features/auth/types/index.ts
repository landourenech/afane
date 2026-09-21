import type { UserProfile, UserRole } from '@/types/user';

export interface AuthUser {
  id: string;
  email: string;
  firebase_uid: string;
  display_name?: string;
  avatar_url?: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
}
