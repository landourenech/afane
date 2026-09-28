import { createClient } from '@/lib/supabase/client';

export interface GroupProposal {
  id: string;
  publication_id: string;
  proposer_id: string;
  proposed_price: number;
  min_quantity: number;
  message: string | null;
  deadline_days: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'completed';
  created_at: string;
  expires_at: string | null;
  proposer?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const proposalService = {
  /* Propositions pour une publication */
  async getByPublication(publicationId: string): Promise<GroupProposal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('group_proposals')
      .select(`
        *,
        proposer:profiles!group_proposals_proposer_id_fkey(
          display_name, username, avatar_url
        )
      `)
      .eq('publication_id', publicationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getByPublication error:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      proposer: Array.isArray(row.proposer) ? row.proposer[0] : row.proposer,
    }));
  },

  /* Mes propositions */
  async getMyProposals(userId: string): Promise<GroupProposal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('group_proposals')
      .select('*')
      .eq('proposer_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as GroupProposal[];
  },

  /* Propositions reçues (pour mes produits) */
  async getReceivedProposals(userId: string): Promise<GroupProposal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('group_proposals')
      .select(`
        *,
        publication:publications!group_proposals_publication_id_fkey(
          id, title, images, price, unit, user_id
        ),
        proposer:profiles!group_proposals_proposer_id_fkey(
          display_name, username, avatar_url
        )
      `)
      .eq('publication.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];

    return (data || [])
      .filter((row: any) => row.publication)
      .map((row: any) => ({
        ...row,
        proposer: Array.isArray(row.proposer) ? row.proposer[0] : row.proposer,
        publication: Array.isArray(row.publication) ? row.publication[0] : row.publication,
      }));
  },

  /* Créer une proposition */
  async create(input: {
    publication_id: string;
    proposer_id: string;
    proposed_price: number;
    min_quantity: number;
    message?: string;
    deadline_days?: number;
  }): Promise<GroupProposal | null> {
    const supabase = createClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (input.deadline_days || 7));

    const { data, error } = await supabase
      .from('group_proposals')
      .insert({
        ...input,
        deadline_days: input.deadline_days || 7,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('create proposal error:', error);
      return null;
    }
    return data as GroupProposal;
  },

  /* Accepter une proposition (vendeur) */
  async accept(proposalId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.rpc('accept_group_proposal', {
      proposal_id: proposalId,
    });

    if (error) {
      console.error('accept error:', error);
      return false;
    }
    return true;
  },

  /* Refuser une proposition */
  async reject(proposalId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('group_proposals')
      .update({ status: 'rejected', responded_at: new Date().toISOString() })
      .eq('id', proposalId);

    return !error;
  },
};
