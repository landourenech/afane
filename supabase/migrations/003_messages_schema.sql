-- ═══════════════════════════════════════════════════════════
-- AFANE 2.0 — Messagerie
-- ═══════════════════════════════════════════════════════════

-- Conversations (1-à-1)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_participants UNIQUE (participant_1, participant_2),
  CONSTRAINT different_participants CHECK (participant_1 != participant_2)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_participants
  ON conversations(participant_1, participant_2);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message
  ON conversations(last_message_at DESC);

-- Trigger : mise à jour last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_last_message ON messages;
CREATE TRIGGER trigger_update_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politique : voir uniquement ses conversations
DROP POLICY IF EXISTS "Voir ses conversations" ON conversations;
CREATE POLICY "Voir ses conversations"
  ON conversations FOR SELECT
  USING (
    auth.uid()::text = participant_1::text
    OR auth.uid()::text = participant_2::text
  );

-- Politique : créer une conversation
DROP POLICY IF EXISTS "Créer une conversation" ON conversations;
CREATE POLICY "Créer une conversation"
  ON conversations FOR INSERT
  WITH CHECK (
    auth.uid()::text = participant_1::text
    OR auth.uid()::text = participant_2::text
  );

-- Politique : voir ses messages
DROP POLICY IF EXISTS "Voir les messages de ses conversations" ON messages;
CREATE POLICY "Voir les messages de ses conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (auth.uid()::text = c.participant_1::text
        OR auth.uid()::text = c.participant_2::text)
    )
  );

-- Politique : envoyer un message
DROP POLICY IF EXISTS "Envoyer un message" ON messages;
CREATE POLICY "Envoyer un message"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid()::text = sender_id::text
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (auth.uid()::text = c.participant_1::text
        OR auth.uid()::text = c.participant_2::text)
    )
  );

-- Politique : marquer comme lu
DROP POLICY IF EXISTS "Marquer comme lu" ON messages;
CREATE POLICY "Marquer comme lu"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (auth.uid()::text = c.participant_1::text
        OR auth.uid()::text = c.participant_2::text)
    )
  );
