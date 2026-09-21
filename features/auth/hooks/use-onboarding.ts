'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { OnboardingInput } from '../schemas/onboarding.schema';

export function useOnboarding() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (data: OnboardingInput) => {
    if (!profile) {
      setError('Utilisateur non connecté');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/profile/complete-onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete onboarding');
      }

      const updatedProfile = await response.json();
      const destination =
        updatedProfile.role === 'admin'
          ? '/admin'
          : `/${updatedProfile.username || profile.id}`;

      window.location.href = destination;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la finalisation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
