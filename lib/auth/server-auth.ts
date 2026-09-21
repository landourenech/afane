import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { UserProfile } from '@/types/user';

export async function requireAuth(): Promise<{ user: any; profile: UserProfile }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) redirect('/onboarding');
  if (!profile.onboarding_completed) redirect('/onboarding');

  return { user, profile: profile as UserProfile };
}

export async function requireOwnership(username: string): Promise<{ user: any; profile: UserProfile }> {
  const { user, profile } = await requireAuth();
  const currentUsername = profile.username || user.id;
  if (currentUsername !== username) redirect(`/${currentUsername}`);
  return { user, profile };
}

export async function requireAdmin(): Promise<{ user: any; profile: UserProfile }> {
  const { user, profile } = await requireAuth();
  if (profile.role !== 'admin') redirect(`/${profile.username || user.id}`);
  return { user, profile };
}
