import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@/types/user';

/**
 * Vérifie que l'utilisateur est connecté et a complété son onboarding.
 * Redirige vers /login ou /onboarding si nécessaire.
 */
export async function requireAuth(): Promise<{
  user: any;
  profile: User;
}> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) redirect('/onboarding');
  if (!profile.onboarding_completed) redirect('/onboarding');

  return { user, profile: profile as User };
}

/**
 * Vérifie que l'utilisateur accède à son propre espace.
 */
export async function requireOwnership(username: string): Promise<{
  user: any;
  profile: User;
}> {
  const { user, profile } = await requireAuth();
  const currentUsername = profile.username || user.id;

  if (currentUsername !== username) {
    redirect(`/${currentUsername}`);
  }

  return { user, profile };
}

/**
 * Vérifie que l'utilisateur est administrateur.
 */
export async function requireAdmin(): Promise<{
  user: any;
  profile: User;
}> {
  const { user, profile } = await requireAuth();

  if (profile.role !== 'admin') {
    redirect(`/${profile.username || user.id}`);
  }

  return { user, profile };
}
