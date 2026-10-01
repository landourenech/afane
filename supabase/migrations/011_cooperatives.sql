-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Coopératives
-- ═══════════════════════════════════════════════════════════

-- Enums
DO $$ BEGIN
  CREATE TYPE cooperative_role AS ENUM ('president', 'treasurer', 'secretary', 'member');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE cooperative_status AS ENUM ('active', 'pending', 'suspended', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Table cooperatives
CREATE TABLE IF NOT EXISTS cooperatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,

  -- Localisation
  region TEXT,
  city TEXT,
  address TEXT,

  -- Contact
  phone TEXT,
  email TEXT,

  -- Métadonnées
  founded_year INT,
  registration_number TEXT,

  -- Stats
  member_count INT DEFAULT 0,
  product_count INT DEFAULT 0,

  -- Statut
  status cooperative_status DEFAULT 'active',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cooperatives_region ON cooperatives(region, status);
CREATE INDEX IF NOT EXISTS idx_cooperatives_slug ON cooperatives(slug);

-- Table cooperative_members
CREATE TABLE IF NOT EXISTS cooperative_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role cooperative_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  contribution_share NUMERIC(5, 2) DEFAULT 0,
  CONSTRAINT unique_coop_member UNIQUE (cooperative_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_coop_members_user ON cooperative_members(user_id);
CREATE INDEX IF NOT EXISTS idx_coop_members_coop ON cooperative_members(cooperative_id, role);

-- Table cooperative_products (publications attachées à une coop)
CREATE TABLE IF NOT EXISTS cooperative_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_coop_product UNIQUE (cooperative_id, publication_id)
);

CREATE INDEX IF NOT EXISTS idx_coop_products_coop ON cooperative_products(cooperative_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_cooperatives_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cooperatives_updated_at ON cooperatives;
CREATE TRIGGER trigger_cooperatives_updated_at
  BEFORE UPDATE ON cooperatives
  FOR EACH ROW
  EXECUTE FUNCTION update_cooperatives_updated_at();

-- Trigger member_count auto
CREATE OR REPLACE FUNCTION update_cooperative_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE cooperatives SET member_count = member_count + 1 WHERE id = NEW.cooperative_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE cooperatives SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.cooperative_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_coop_member_count ON cooperative_members;
CREATE TRIGGER trigger_coop_member_count
  AFTER INSERT OR DELETE ON cooperative_members
  FOR EACH ROW
  EXECUTE FUNCTION update_cooperative_member_count();

-- RLS
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_products ENABLE ROW LEVEL SECURITY;

-- Policies cooperatives
DROP POLICY IF EXISTS "Voir les coopératives" ON cooperatives;
CREATE POLICY "Voir les coopératives"
  ON cooperatives FOR SELECT
  USING (status = 'active' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Créer une coopérative" ON cooperatives;
CREATE POLICY "Créer une coopérative"
  ON cooperatives FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Modifier sa coopérative" ON cooperatives;
CREATE POLICY "Modifier sa coopérative"
  ON cooperatives FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM cooperative_members cm
      WHERE cm.cooperative_id = cooperatives.id
        AND cm.user_id = auth.uid()
        AND cm.role = 'president'
    )
  );

-- Policies members
DROP POLICY IF EXISTS "Voir les membres" ON cooperative_members;
CREATE POLICY "Voir les membres"
  ON cooperative_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Rejoindre une coopérative" ON cooperative_members;
CREATE POLICY "Rejoindre une coopérative"
  ON cooperative_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Quitter une coopérative" ON cooperative_members;
CREATE POLICY "Quitter une coopérative"
  ON cooperative_members FOR DELETE
  USING (auth.uid() = user_id);

-- Policies products
DROP POLICY IF EXISTS "Voir les produits coop" ON cooperative_products;
CREATE POLICY "Voir les produits coop"
  ON cooperative_products FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Ajouter un produit coop" ON cooperative_products;
CREATE POLICY "Ajouter un produit coop"
  ON cooperative_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cooperative_members cm
      WHERE cm.cooperative_id = cooperative_products.cooperative_id
        AND cm.user_id = auth.uid()
    )
  );

-- RPC : rejoindre avec fonction
CREATE OR REPLACE FUNCTION join_cooperative(p_cooperative_id UUID)
RETURNS UUID AS $$
DECLARE
  v_member_id UUID;
BEGIN
  INSERT INTO cooperative_members (cooperative_id, user_id, role)
  VALUES (p_cooperative_id, auth.uid(), 'member')
  ON CONFLICT (cooperative_id, user_id) DO NOTHING
  RETURNING id INTO v_member_id;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION join_cooperative TO authenticated;
