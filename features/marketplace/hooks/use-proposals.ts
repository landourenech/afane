'use client';

import { useState, useEffect, useCallback } from 'react';
import { proposalService, type GroupProposal } from '../services/proposal.service';

export function useProposals(publicationId: string | undefined) {
  const [proposals, setProposals] = useState<GroupProposal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!publicationId) return;
    setLoading(true);
    const data = await proposalService.getByPublication(publicationId);
    setProposals(data);
    setLoading(false);
  }, [publicationId]);

  useEffect(() => {
    load();
  }, [load]);

  return { proposals, loading, refresh: load };
}

export function useReceivedProposals(userId: string | undefined) {
  const [proposals, setProposals] = useState<GroupProposal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const data = await proposalService.getReceivedProposals(userId);
    setProposals(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { proposals, loading, refresh: load };
}
