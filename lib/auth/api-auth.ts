import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { UserProfile } from '@/types/user';

export async function getAuthUser(): Promise<
  | { error: NextResponse }
  | { user: any; profile: UserProfile; supabase: any }
> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    return { error: NextResponse.json({ error: 'Profil introuvable' }, { status: 404 }) };
  }

  return { user, profile: profile as UserProfile, supabase };
}

export async function requireAdminApi(): Promise<
  | { error: NextResponse }
  | { user: any; profile: UserProfile; supabase: any }
> {
  const auth = await getAuthUser();
  if ('error' in auth) return auth;
  if (auth.profile.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) };
  }
  return auth;
}
