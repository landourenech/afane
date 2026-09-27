-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Commandes (Orders)
-- ═══════════════════════════════════════════════════════════

-- Statuts de commande
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',      -- en attente de paiement
    'confirmed',    -- confirmée
    'preparing',    -- en préparation
    'shipped',      -- expédiée
    'delivered',    -- livrée
    'cancelled',    -- annulée
    'refunded'      -- remboursée
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_option AS ENUM ('pickup', 'standard', 'express');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('mobile_money', 'card', 'cash_on_delivery');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Table orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  
  -- Acheteur
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Statut
  status order_status NOT NULL DEFAULT 'pending',
  
  -- Montants
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  delivery_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  service_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  
  -- Livraison
  delivery_option delivery_option NOT NULL DEFAULT 'standard',
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_region TEXT,
  delivery_phone TEXT NOT NULL,
  delivery_notes TEXT,
  
  -- Paiement
  payment_method payment_method NOT NULL DEFAULT 'mobile_money',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

-- Table order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Snapshot produit (au cas où le produit change)
  title TEXT NOT NULL,
  image_url TEXT,
  price_per_unit NUMERIC(12, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quantity NUMERIC(10, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer
  ON orders(buyer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_seller
  ON order_items(seller_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Générer un numéro de commande lisible
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INT;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM orders
  WHERE created_at >= DATE_TRUNC('year', NOW());
  new_number := 'AF-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politique orders : acheteur voit ses commandes
DROP POLICY IF EXISTS "Acheteur voit ses commandes" ON orders;
CREATE POLICY "Acheteur voit ses commandes"
  ON orders FOR SELECT
  USING (auth.uid() = buyer_id);

-- Politique orders : vendeur voit ses ventes
DROP POLICY IF EXISTS "Vendeur voit ses ventes" ON orders;
CREATE POLICY "Vendeur voit ses ventes"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      WHERE oi.order_id = orders.id
      AND oi.seller_id = auth.uid()
    )
  );

-- Politique orders : créer une commande
DROP POLICY IF EXISTS "Créer une commande" ON orders;
CREATE POLICY "Créer une commande"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Politique orders : mettre à jour (annuler par exemple)
DROP POLICY IF EXISTS "Mettre à jour sa commande" ON orders;
CREATE POLICY "Mettre à jour sa commande"
  ON orders FOR UPDATE
  USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

-- Politique order_items
DROP POLICY IF EXISTS "Voir ses order_items" ON order_items;
CREATE POLICY "Voir ses order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (
        o.buyer_id = auth.uid()
        OR order_items.seller_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Créer des order_items" ON order_items;
CREATE POLICY "Créer des order_items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND o.buyer_id = auth.uid()
    )
  );
