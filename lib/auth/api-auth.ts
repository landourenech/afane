import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function getAuthUser() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile) {
    return { error: NextResponse.json({ error: 'Profil introuvable' }, { status: 404 }) };
  }
  return { user, profile, supabase };
}
