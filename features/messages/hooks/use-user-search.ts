'use client';

import { useState, useEffect } from 'react';
import { searchUsers } from '../services/message.service';

export interface SearchUser {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
}

export function useUserSearch(
  query: string,
  currentUserId: string | undefined
) {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Minimum 2 caractères + auth obligatoire
    if (!query.trim() || query.trim().length < 2 || !currentUserId) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchUsers(query, currentUserId);
        setUsers(results as SearchUser[]);
      } catch (err) {
        console.error('Erreur search:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUserId]);

  return { users, loading };
}
