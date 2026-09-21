'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { UserProfile } from '@/types/user';

export function useCurrentProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentProfile();
      setProfile(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, loading, error, refresh: load };
}
