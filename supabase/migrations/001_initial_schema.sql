-- ═══════════════════════════════════════════════════════════
-- AFANE — Schéma initial de la base de données
-- Version : 1.0
-- ═══════════════════════════════════════════════════════════

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════
-- TABLE : profiles
-- Description : Profils utilisateurs AFANE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  -- Identifiants
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  
  -- Informations personnelles
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  
  -- Localisation
  country TEXT DEFAULT 'Gabon',
  region TEXT,
  department TEXT,
  city TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Rôle et statut
  role TEXT NOT NULL DEFAULT 'user' CHECK (
    role IN ('user', 'producer', 'cooperative', 'buyer', 'supplier', 'advisor', 'admin')
  ),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'verified', 'rejected')
  ),
  
  -- Informations producteur
  farm_name TEXT,
  farm_size DECIMAL,
  main_crops TEXT[],
  farming_experience INTEGER,
  
  -- Informations coopérative
  cooperative_name TEXT,
  number_of_members INTEGER,
  cooperative_registration TEXT,
  
  -- Informations acheteur
  company_name TEXT,
  business_type TEXT,
  purchase_capacity TEXT,
  
  -- Informations fournisseur
  supplier_company TEXT,
  product_categories TEXT[],
  supplier_license TEXT,
  
  -- Informations conseiller
  specialization TEXT,
  certifications TEXT[],
  years_of_experience INTEGER,
  
  -- Préférences
  preferred_language TEXT DEFAULT 'fr',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed_at TIMESTAMPTZ
);

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);

-- ═══════════════════════════════════════════════════════════
-- TABLE : publications
-- Description : Publications de produits agricoles
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS publications (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenu
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Prix et quantité
  price DECIMAL NOT NULL CHECK (price >= 0),
  quantity DECIMAL NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  unit TEXT DEFAULT 'unité',
  
  -- Catégorisation
  main_category TEXT NOT NULL,
  sub_category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Vente
  sale_type TEXT DEFAULT 'individual' CHECK (sale_type IN ('individual', 'group')),
  condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
  
  -- Vente groupée
  min_group_quantity INTEGER,
  max_group_quantity INTEGER,
  group_price DECIMAL,
  bulk_discount DECIMAL DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER,
  
  -- Localisation
  location TEXT,
  
  -- Statut
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'sold', 'expired', 'cancelled')
  ),
  views_count INTEGER DEFAULT 0,
  
  -- Durée
  duration_days INTEGER DEFAULT 7,
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_publications_user ON publications(user_id);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(main_category);
CREATE INDEX IF NOT EXISTS idx_publications_created ON publications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_publications_price ON publications(price);
CREATE INDEX IF NOT EXISTS idx_publications_sale_type ON publications(sale_type);

-- Index de recherche plein texte
CREATE INDEX IF NOT EXISTS idx_publications_search ON publications 
USING GIN (to_tsvector('french', title || ' ' || COALESCE(description, '')));

-- ═══════════════════════════════════════════════════════════
-- TABLE : orders
-- Description : Commandes entre acheteurs et vendeurs
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS orders (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  publication_id UUID REFERENCES publications(id) ON DELETE SET NULL,
  
  -- Contenu
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL NOT NULL CHECK (unit_price >= 0),
  total_amount DECIMAL NOT NULL CHECK (total_amount >= 0),
  
  -- Statut
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
  ),
  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'refunded')
  ),
  
  -- Informations
  notes TEXT,
  delivery_address TEXT,
  delivery_date TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Index
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- TABLE : notifications
-- Description : Notifications utilisateurs
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenu
  type TEXT NOT NULL CHECK (
    type IN (
      'publication_created',
      'publication_sold',
      'publication_expired',
      'publication_cancelled',
      'new_order',
      'order_confirmed',
      'order_shipped',
      'order_delivered',
      'new_message',
      'new_follower',
      'price_alert',
      'system'
    )
  ),
  title TEXT NOT NULL,
  content TEXT,
  link TEXT,
  
  -- Statut
  read BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ═══════════════════════════════════════════════════════════
-- TABLE : messages
-- Description : Messagerie entre utilisateurs
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS messages (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenu
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  
  -- Statut
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- TABLE : farms
-- Description : Exploitations agricoles (pour la carte)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS farms (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  department TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Détails
  area_hectares DECIMAL,
  main_crops TEXT[],
  production_type TEXT DEFAULT 'producer' CHECK (
    production_type IN ('producer', 'cooperative')
  ),
  
  -- Vérification
  verified BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_farms_owner ON farms(owner_id);
CREATE INDEX IF NOT EXISTS idx_farms_region ON farms(region);
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms(latitude, longitude);

-- ═══════════════════════════════════════════════════════════
-- FONCTIONS ET TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Fonction : mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_publications_updated_at ON publications;
CREATE TRIGGER update_publications_updated_at
  BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_farms_updated_at ON farms;
CREATE TRIGGER update_farms_updated_at
  BEFORE UPDATE ON farms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- FONCTION : expirer les publications
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION expire_publications()
RETURNS void AS $$
BEGIN
  UPDATE publications
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
