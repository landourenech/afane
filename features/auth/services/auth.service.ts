import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/user';

export const authService = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return profile as UserProfile | null;
  },

  /**
   * Synchroniser Firebase → Supabase
   */
  async syncUser(data: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
  }): Promise<UserProfile | null> {
    const response = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.profile as UserProfile | null;
  },

  /**
   * Compléter l'onboarding
   */
  async completeOnboarding(profileId: string, data: any): Promise<UserProfile | null> {
    const response = await fetch('/api/profile/complete-onboarding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, ...data }),
    });

    if (!response.ok) return null;

    return (await response.json()) as UserProfile;
  },
};
