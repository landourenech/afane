'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/* Seul dateOfBirth diffère (camelCase form → snake_case DB) */
function mapFields(data: any): Record<string, any> {
  const mapped: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'dateOfBirth') {
      mapped['date_of_birth'] = value;
    } else {
      mapped[key] = value;
    }
  }
  return mapped;
}

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, refreshProfile } = useAuth();

  const submit = async (data: any) => {
    if (!profile?.id) {
      setError('Utilisateur non connecté');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const mapped = mapFields(data);

      /* Filtrer les valeurs vides pour éviter d'écraser avec '' */
      const clean: Record<string, any> = {};
      for (const [k, v] of Object.entries(mapped)) {
        if (v !== '' && v !== null && v !== undefined) {
          clean[k] = v;
        }
      }

      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...clean,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) throw updateError;

      await refreshProfile();

      const username = updated.username || updated.id;
      window.location.href = `/${username}`;
      return true;
    } catch (err: any) {
      console.error('❌ Erreur onboarding:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
