-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Présence utilisateurs (en ligne / hors ligne)
-- ═══════════════════════════════════════════════════════════

-- Colonne last_seen_at
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- Index pour les requêtes de présence
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen
  ON profiles(last_seen_at DESC);

-- Fonction pour mettre à jour last_seen_at
CREATE OR REPLACE FUNCTION update_last_seen(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET last_seen_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
