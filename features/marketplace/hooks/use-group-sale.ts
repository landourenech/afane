'use client';

import { useState, useEffect, useCallback } from 'react';
import { groupSaleService, type GroupProgress, type GroupParticipant } from '../services/group-sale.service';

export function useGroupSale(publicationId: string | undefined, currentUserId: string | undefined) {
  const [progress, setProgress] = useState<GroupProgress | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!publicationId) return;
    setLoading(true);

    const [p, parts] = await Promise.all([
      groupSaleService.getProgress(publicationId),
      groupSaleService.getParticipants(publicationId),
    ]);

    setProgress(p);
    setParticipants(parts);

    if (currentUserId) {
      setIsParticipant(parts.some((x) => x.user_id === currentUserId));
    }

    setLoading(false);
  }, [publicationId, currentUserId]);

  useEffect(() => {
    load();

    /* Realtime : recharger si quelqu'un rejoint */
    if (!publicationId) return;
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();

    const channel = supabase
      .channel(`group-${publicationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_participants',
          filter: `publication_id=eq.${publicationId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [publicationId, load]);

  const join = async (quantity = 1) => {
    if (!publicationId || !currentUserId) return false;
    const ok = await groupSaleService.join(publicationId, currentUserId, quantity);
    if (ok) await load();
    return ok;
  };

  const leave = async () => {
    if (!publicationId || !currentUserId) return false;
    const ok = await groupSaleService.leave(publicationId, currentUserId);
    if (ok) await load();
    return ok;
  };

  return { progress, participants, isParticipant, loading, join, leave, refresh: load };
}
