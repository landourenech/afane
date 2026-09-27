'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settings.service';
import type { UserPreferences } from '../types';

export function useUserPreferences(userId: string | undefined) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const prefs = await settingsService.getPreferences(userId);
      setPreferences(prefs);
    } catch (err) {
      console.error('Erreur chargement préférences:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (updates: Partial<UserPreferences>) => {
    if (!userId || !preferences) return;
    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    await settingsService.savePreferences(userId, updated);
  };

  return { preferences, loading, update, refresh: load };
}
