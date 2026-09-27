'use client';

import { useState, useEffect } from 'react';
import { searchUsers } from '../services/message.service';

export interface SearchUser {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  email: string | null;
}

export type SearchMode = 'text' | 'email' | 'phone';

export function detectSearchMode(query: string): SearchMode {
  const trimmed = query.trim();
  if (trimmed.includes('@')) return 'email';
  if (/^[\d\s+\-()]+$/.test(trimmed) && trimmed.replace(/\D/g, '').length >= 3) {
    return 'phone';
  }
  return 'text';
}

export function useUserSearch(
  query: string,
  currentUserId: string | undefined
) {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<SearchMode>('text');

  useEffect(() => {
    if (!query.trim() || !currentUserId) {
      setUsers([]);
      setMode('text');
      return;
    }

    setMode(detectSearchMode(query));

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchUsers(query, currentUserId);
        setUsers(results as SearchUser[]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUserId]);

  return { users, loading, mode };
}
