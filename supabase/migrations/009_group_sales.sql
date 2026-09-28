-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Vente groupée (Group Buying)
-- ═══════════════════════════════════════════════════════════

-- Participants à une vente groupée
CREATE TABLE IF NOT EXISTS group_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_participant UNIQUE (publication_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_participants_pub
  ON group_participants(publication_id, joined_at DESC);

CREATE INDEX IF NOT EXISTS idx_group_participants_user
  ON group_participants(user_id);

-- RLS
ALTER TABLE group_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Voir les participants" ON group_participants;
CREATE POLICY "Voir les participants"
  ON group_participants FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Rejoindre un groupe" ON group_participants;
CREATE POLICY "Rejoindre un groupe"
  ON group_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Quitter un groupe" ON group_participants;
CREATE POLICY "Quitter un groupe"
  ON group_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Vue enrichie : progression du groupe
CREATE OR REPLACE VIEW group_sale_progress AS
SELECT 
  p.id AS publication_id,
  p.title,
  p.min_group_quantity,
  p.group_price,
  p.price AS base_price,
  COUNT(DISTINCT gp.id) AS participants_count,
  COALESCE(SUM(gp.quantity), 0) AS total_quantity,
  CASE 
    WHEN COALESCE(SUM(gp.quantity), 0) >= p.min_group_quantity THEN true
    ELSE false
  END AS is_complete
FROM publications p
LEFT JOIN group_participants gp ON gp.publication_id = p.id
WHERE p.sale_type = 'group'
GROUP BY p.id;

GRANT SELECT ON group_sale_progress TO authenticated;
