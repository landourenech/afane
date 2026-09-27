-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Sécurisation recherche utilisateurs
-- ═══════════════════════════════════════════════════════════

-- 1. Vue publique (SANS email, phone)
DROP VIEW IF EXISTS public_profiles CASCADE;

CREATE VIEW public_profiles AS
SELECT
  id,
  display_name,
  username,
  avatar_url,
  role,
  bio,
  city,
  region,
  country,
  last_seen_at,
  onboarding_completed,
  verification_status
FROM profiles
WHERE role != 'admin';   -- ✅ Aucun admin exposé

GRANT SELECT ON public_profiles TO authenticated;

-- 2. RLS : renforcer la lecture des profils
DROP POLICY IF EXISTS "Voir les profils" ON profiles;
DROP POLICY IF EXISTS "Voir son propre profil" ON profiles;
DROP POLICY IF EXISTS "Voir les autres profils (champs limités)" ON profiles;

CREATE POLICY "Voir son propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Voir les autres profils (non-admins)"
  ON profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND id != auth.uid()
    AND role != 'admin'
  );

-- 3. Fonction RPC sécurisée pour la recherche
DROP FUNCTION IF EXISTS search_users_secure(TEXT, UUID, INT);

CREATE OR REPLACE FUNCTION search_users_secure(
  search_query TEXT,
  exclude_user_id UUID,
  max_results INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  username TEXT,
  avatar_url TEXT,
  role TEXT
) AS $$
BEGIN
  -- Minimum 2 caractères
  IF LENGTH(TRIM(search_query)) < 2 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.display_name,
    p.username,
    p.avatar_url,
    p.role
  FROM profiles p
  WHERE
    p.id != exclude_user_id
    AND p.role != 'admin'
    AND (
      p.display_name ILIKE '%' || search_query || '%'
      OR p.username ILIKE '%' || search_query || '%'
    )
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION search_users_secure TO authenticated;
