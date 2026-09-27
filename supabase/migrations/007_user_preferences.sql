-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Préférences utilisateurs
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Voir ses préférences" ON user_preferences;
CREATE POLICY "Voir ses préférences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Modifier ses préférences" ON user_preferences;
CREATE POLICY "Modifier ses préférences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user
  ON user_preferences(user_id);
