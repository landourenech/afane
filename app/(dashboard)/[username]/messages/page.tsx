'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList } from '@/features/messages/components/ConversationList';
import { ChatWindow } from '@/features/messages/components/ChatWindow';
import { NewConversationModal } from '@/features/messages/components/NewConversationModal';
import { useConversations } from '@/features/messages/hooks/use-conversations';
import { useMessages } from '@/features/messages/hooks/use-messages';
import { usePresenceHeartbeat } from '@/features/messages/hooks/use-presence';
import type { Conversation } from '@/features/messages/types';

export default function MessagesPage() {
  const params = useParams();
  const username = params?.username as string;
  const { profile } = useAuth();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Heartbeat : marque l'utilisateur comme actif
  usePresenceHeartbeat(profile?.id);

  const { conversations, loading: loadingConversations, refresh } =
    useConversations(profile?.id);

  const { messages, loading: loadingMessages, send } = useMessages(
    selectedConversation?.id || null,
    profile?.id
  );

  const handleSelect = (conv: Conversation) => {
    setSelectedConversation(conv);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const handleNewConversation = () => setModalOpen(true);

  const handleConversationCreated = async (conversationId: string) => {
    await refresh();
    setTimeout(() => {
      const found = conversations.find((c) => c.id === conversationId);
      if (found) setSelectedConversation(found);
    }, 300);
  };

  return (
    <>
      <div className="h-[calc(100vh-3.5rem-4rem)] md:h-[calc(100vh-69.5px)] flex overflow-hidden">
        <div
          className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${
            selectedConversation ? 'hidden md:block' : 'block'
          }`}
        >
          <ConversationList
            conversations={conversations}
            loading={loadingConversations}
            selectedId={selectedConversation?.id || null}
            onSelect={handleSelect}
            onNewConversation={handleNewConversation}
            currentUserId={profile?.id || ''}
          />
        </div>

        <div
          className={`flex-1 min-w-0 ${
            selectedConversation ? 'block' : 'hidden md:block'
          }`}
        >
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            loading={loadingMessages}
            currentUserId={profile?.id || ''}
            onSend={send}
            onBack={handleBack}
          />
        </div>
      </div>

      {profile?.id && (
        <NewConversationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          currentUserId={profile.id}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </>
  );
}
