-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Propositions de vente collective
-- ═══════════════════════════════════════════════════════════

-- Une proposition = un acheteur propose un prix de groupe au vendeur
CREATE TABLE IF NOT EXISTS group_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  proposer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Proposition
  proposed_price NUMERIC(12, 2) NOT NULL,
  min_quantity NUMERIC(10, 2) NOT NULL,
  message TEXT,
  deadline_days INT DEFAULT 7,
  
  -- Statut
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'completed')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_group_proposals_pub
  ON group_proposals(publication_id, status);

CREATE INDEX IF NOT EXISTS idx_group_proposals_proposer
  ON group_proposals(proposer_id, created_at DESC);

-- RLS
ALTER TABLE group_proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Voir les propositions" ON group_proposals;
CREATE POLICY "Voir les propositions"
  ON group_proposals FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Créer une proposition" ON group_proposals;
CREATE POLICY "Créer une proposition"
  ON group_proposals FOR INSERT
  WITH CHECK (auth.uid() = proposer_id);

DROP POLICY IF EXISTS "Modifier sa proposition" ON group_proposals;
CREATE POLICY "Modifier sa proposition"
  ON group_proposals FOR UPDATE
  USING (auth.uid() = proposer_id)
  WITH CHECK (auth.uid() = proposer_id);

-- Fonction : accepter une proposition (transforme le produit en vente collective)
CREATE OR REPLACE FUNCTION accept_group_proposal(proposal_id UUID)
RETURNS VOID AS $$
DECLARE
  v_proposal RECORD;
BEGIN
  SELECT * INTO v_proposal FROM group_proposals WHERE id = proposal_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposition introuvable';
  END IF;

  -- Mettre à jour la proposition
  UPDATE group_proposals
  SET 
    status = 'accepted',
    responded_at = NOW(),
    updated_at = NOW()
  WHERE id = proposal_id;

  -- Transformer la publication en vente collective
  UPDATE publications
  SET
    sale_type = 'group',
    group_price = v_proposal.proposed_price,
    min_group_quantity = v_proposal.min_quantity,
    bulk_discount = ROUND(
      ((price - v_proposal.proposed_price) / price * 100)::numeric, 
      2
    ),
    updated_at = NOW()
  WHERE id = v_proposal.publication_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION accept_group_proposal TO authenticated;
