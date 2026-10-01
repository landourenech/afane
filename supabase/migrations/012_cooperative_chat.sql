-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Chat de coopérative
-- ═══════════════════════════════════════════════════════════

-- 1. Ajouter cooperative_id à conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_conversations_cooperative
  ON conversations(cooperative_id) WHERE cooperative_id IS NOT NULL;

-- 2. RPC : get or create cooperative chat
CREATE OR REPLACE FUNCTION get_or_create_cooperative_chat(p_cooperative_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conv_id UUID;
  v_coop RECORD;
  v_president_id UUID;
  v_group_name TEXT;
BEGIN
  -- Récupérer la coopérative
  SELECT c.id, c.name, c.logo_url, c.created_by
  INTO v_coop
  FROM cooperatives c
  WHERE c.id = p_cooperative_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Coopérative introuvable';
  END IF;

  v_president_id := v_coop.created_by;
  v_group_name := '🌾 ' || v_coop.name;

  -- Chercher existante
  SELECT id INTO v_conv_id
  FROM conversations
  WHERE cooperative_id = p_cooperative_id AND type = 'cooperative'
  LIMIT 1;

  -- Créer si inexistante
  IF v_conv_id IS NULL THEN
    INSERT INTO conversations (
      type, cooperative_id, name, avatar_url, created_at, updated_at
    ) VALUES (
      'cooperative',
      p_cooperative_id,
      v_group_name,
      v_coop.logo_url,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_conv_id;

    -- Ajouter le président
    IF v_president_id IS NOT NULL THEN
      INSERT INTO conversation_members (conversation_id, user_id, role)
      VALUES (v_conv_id, v_president_id, 'admin')
      ON CONFLICT DO NOTHING;
    END IF;

    -- Ajouter tous les membres existants
    INSERT INTO conversation_members (conversation_id, user_id, role)
    SELECT v_conv_id, cm.user_id,
      CASE 
        WHEN cm.role = 'president' THEN 'admin'
        ELSE 'member'
      END
    FROM cooperative_members cm
    WHERE cm.cooperative_id = p_cooperative_id
    ON CONFLICT DO NOTHING;
  ELSE
    -- Mettre à jour le nom
    UPDATE conversations
    SET name = v_group_name, updated_at = NOW()
    WHERE id = v_conv_id;
  END IF;

  -- S'assurer que l'utilisateur actuel est membre
  INSERT INTO conversation_members (conversation_id, user_id, role)
  VALUES (
    v_conv_id,
    auth.uid(),
    CASE 
      WHEN auth.uid() = v_president_id THEN 'admin' 
      ELSE 'member' 
    END
  )
  ON CONFLICT DO NOTHING;

  RETURN v_conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_or_create_cooperative_chat TO authenticated;

-- 3. Trigger : auto-add membre coop au chat
CREATE OR REPLACE FUNCTION auto_add_to_cooperative_chat()
RETURNS TRIGGER AS $$
DECLARE
  v_conv_id UUID;
BEGIN
  SELECT id INTO v_conv_id
  FROM conversations
  WHERE cooperative_id = NEW.cooperative_id AND type = 'cooperative'
  LIMIT 1;

  IF v_conv_id IS NOT NULL THEN
    INSERT INTO conversation_members (conversation_id, user_id, role)
    VALUES (
      v_conv_id,
      NEW.user_id,
      CASE WHEN NEW.role = 'president' THEN 'admin' ELSE 'member' END
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_add_coop_chat ON cooperative_members;
CREATE TRIGGER trigger_auto_add_coop_chat
  AFTER INSERT ON cooperative_members
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_to_cooperative_chat();

-- 4. Trigger : notifier quand nouveau membre
CREATE OR REPLACE FUNCTION notify_new_cooperative_member()
RETURNS TRIGGER AS $$
DECLARE
  v_president_id UUID;
  v_coop_name TEXT;
  v_member_name TEXT;
BEGIN
  SELECT c.created_by, c.name INTO v_president_id, v_coop_name
  FROM cooperatives c WHERE c.id = NEW.cooperative_id;

  SELECT COALESCE(display_name, username, 'Un utilisateur')
  INTO v_member_name FROM profiles WHERE id = NEW.user_id;

  IF v_president_id IS NOT NULL AND v_president_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, title, content, link)
    VALUES (
      v_president_id,
      'cooperative_new_member',
      'Nouveau membre dans la coopérative',
      v_member_name || ' a rejoint ' || v_coop_name,
      '/cooperatives/' || NEW.cooperative_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_new_coop_member ON cooperative_members;
CREATE TRIGGER trigger_notify_new_coop_member
  AFTER INSERT ON cooperative_members
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_cooperative_member();
