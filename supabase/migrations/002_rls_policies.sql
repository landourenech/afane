-- ═══════════════════════════════════════════════════════════
-- AFANE — Row Level Security Policies
-- ═══════════════════════════════════════════════════════════

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════════════════════

CREATE POLICY "Profiles viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users delete own profile"
  ON profiles FOR DELETE USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════
-- PUBLICATIONS
-- ═══════════════════════════════════════════════════════════

CREATE POLICY "Publications viewable by everyone"
  ON publications FOR SELECT
  USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users create own publications"
  ON publications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own publications"
  ON publications FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own publications"
  ON publications FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- ORDERS
-- ═══════════════════════════════════════════════════════════

CREATE POLICY "Users see own orders"
  ON orders FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers create orders"
  ON orders FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Users update own orders"
  ON orders FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers delete own orders"
  ON orders FOR DELETE USING (buyer_id = auth.uid());

-- ═══════════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════

CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users create own notifications"
  ON notifications FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own notifications"
  ON notifications FOR DELETE USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════
-- MESSAGES
-- ═══════════════════════════════════════════════════════════

CREATE POLICY "Users see own messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users send messages"
  ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users update own messages"
  ON messages FOR UPDATE
  USING (receiver_id = auth.uid());

CREATE POLICY "Users delete own messages"
  ON messages FOR DELETE
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- ═══════════════════════════════════════════════════════════
-- FARMS
-- ═══════════════════════════════════════════════════════════

CREATE POLICY "Farms viewable by everyone"
  ON farms FOR SELECT USING (true);

CREATE POLICY "Owners manage own farms"
  ON farms FOR ALL USING (auth.uid() = owner_id);
