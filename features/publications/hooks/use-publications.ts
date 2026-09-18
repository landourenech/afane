'use client';

import { useState, useEffect } from 'react';
import type { Publication } from '../types';

export function usePublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) throw new Error('Erreur chargement');
        const data = await response.json();
        setPublications(data.publications || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { publications, loading, error };
}
