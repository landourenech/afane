'use client';

import { useState, useEffect } from 'react';
import { X, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { useUserSearch } from '../hooks/use-user-search';
import { getOrCreateConversation } from '../services/message.service';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationCreated: (conversationId: string) => void;
}

const roleLabels: Record<string, string> = {
  producer: 'Producteur',
  cooperative: 'Coopérative',
  buyer: 'Acheteur',
  supplier: 'Fournisseur',
  advisor: 'Conseiller',
  admin: 'Admin',
  user: 'Utilisateur',
};

export function NewConversationModal({
  isOpen,
  onClose,
  currentUserId,
  onConversationCreated,
}: NewConversationModalProps) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState<string | null>(null);
  const { users, loading } = useUserSearch(query, currentUserId);

  // Reset à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setCreating(null);
    }
  }, [isOpen]);

  // ESC pour fermer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = async (userId: string) => {
    if (creating) return;
    setCreating(userId);
    try {
      const convId = await getOrCreateConversation(currentUserId, userId);
      onConversationCreated(convId);
      onClose();
    } catch (err) {
      console.error('Erreur création conversation:', err);
      alert('Impossible de créer la conversation');
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full md:max-w-md md:rounded-2xl bg-white rounded-t-3xl md:rounded-b-2xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[70vh] animate-slide-up">
        {/* ═════ Header ═════ */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 rounded-full hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Fermer"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>

          <h2 className="flex-1 font-bold text-gray-900 text-base">
            Nouveau message
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors hidden md:inline-flex"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* ═════ Recherche ═════ */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#e86c00]/30"
            />
          </div>
        </div>

        {/* ═════ Résultats ═════ */}
        <div className="flex-1 overflow-y-auto">
          {!query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-3">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Recherchez un utilisateur
              </p>
              <p className="text-xs text-gray-500">
                Tapez un nom ou @username pour commencer
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-[#e86c00] animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-sm text-gray-500">
                Aucun utilisateur trouvé
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Essayez un autre mot-clé
              </p>
            </div>
          ) : (
            users.map((user) => {
              const isCreating = creating === user.id;
              const isDisabled = creating !== null && !isCreating;

              return (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt={user.display_name || ''}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-[#0c4428] to-[#e86c00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {(user.display_name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {user.display_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.username ? `@${user.username}` : ''}
                      {user.username && ' · '}
                      {roleLabels[user.role] || user.role}
                    </p>
                  </div>

                  {/* Loader sur l'item sélectionné */}
                  {isCreating && (
                    <Loader2 className="h-5 w-5 text-[#e86c00] animate-spin flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
