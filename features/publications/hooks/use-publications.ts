'use client';

import { useState, useEffect, useCallback } from 'react';
import { publicationService } from '../services/publication.service';
import type { Publication } from '../types';

export function usePublications(limit = 50) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await publicationService.getAll(limit);
      setPublications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { publications, loading, error, refresh: load };
}
