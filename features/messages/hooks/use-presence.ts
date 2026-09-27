'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const HEARTBEAT_INTERVAL = 30_000; // 30s
const ONLINE_THRESHOLD = 2 * 60 * 1000; // 2 min

/**
 * Marque l'utilisateur courant comme actif (heartbeat)
 */
export function usePresenceHeartbeat(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const ping = async () => {
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', userId);
    };

    // Ping immédiat
    ping();

    // Ping périodique
    const interval = setInterval(ping, HEARTBEAT_INTERVAL);

    // Ping au focus de la fenêtre
    const handleFocus = () => ping();
    window.addEventListener('focus', handleFocus);

    // Ping à la fermeture (best-effort)
    const handleBeforeUnload = () => {
      navigator.sendBeacon?.(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
        JSON.stringify({ last_seen_at: new Date().toISOString() })
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId]);
}

/**
 * Vérifie si un utilisateur est en ligne
 * @param lastSeenAt Date ISO du dernier ping
 */
export function isUserOnline(lastSeenAt: string | null | undefined): boolean {
  if (!lastSeenAt) return false;
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  return diff < ONLINE_THRESHOLD;
}

/**
 * Hook réutilisable : retourne une fonction isOnline()
 */
export function usePresence() {
  const checkOnline = useCallback((lastSeenAt: string | null | undefined) => {
    return isUserOnline(lastSeenAt);
  }, []);

  return { isOnline: checkOnline };
}
