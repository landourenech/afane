'use client';

import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import type { UserSearchResult } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

export function useUserSearch(query: string, delay = 300) {
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        const data = await userService.search(debouncedQuery);
        setResults(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  return { results, loading, error };
}
