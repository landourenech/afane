'use client';

import { useState, useEffect } from 'react';
import { X, Search, ArrowLeft, Loader2, User } from 'lucide-react';
import { useUserSearch } from '../hooks/use-user-search';
import { getOrCreateConversation } from '../services/message.service';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationCreated: (conversationId: string) => void;
}

// ✅ Pas d'admin dans les labels
const roleLabels: Record<string, string> = {
  producer: 'Producteur',
  cooperative: 'Coopérative',
  buyer: 'Acheteur',
  supplier: 'Fournisseur',
  advisor: 'Conseiller',
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

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setCreating(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = async (userId: string) => {
    if (creating || userId === currentUserId) return;
    setCreating(userId);
    try {
      const convId = await getOrCreateConversation(currentUserId, userId);
      onConversationCreated(convId);
      onClose();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de créer la conversation');
    } finally {
      setCreating(null);
    }
  };

  const tooShort = query.trim().length > 0 && query.trim().length < 2;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full md:max-w-md md:rounded-2xl bg-[var(--bg-primary)] rounded-t-3xl md:rounded-b-2xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[70vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 rounded-full hover:bg-[var(--bg-hover)] transition-colors md:hidden"
            aria-label="Fermer"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
          </button>

          <h2 className="flex-1 font-bold text-[var(--text-primary)] text-base">
            Nouveau message
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] transition-colors hidden md:inline-flex"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Recherche */}
        <div className="p-4 border-b border-[var(--border-primary)] flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom ou @username..."
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-tertiary)] rounded-full text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            />
          </div>
        </div>

        {/* Résultats */}
        <div className="flex-1 overflow-y-auto">
          {!query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="p-4 bg-[var(--bg-tertiary)] rounded-full mb-3">
                <Search className="h-8 w-8 text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Recherchez un utilisateur
              </p>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Par nom ou @username (2 caractères min.)
              </p>
              <div className="flex items-center gap-1 text-[11px] px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full">
                <User className="h-3 w-3" />
                Nom ou @username uniquement
              </div>
            </div>
          ) : tooShort ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Tapez au moins 2 caractères
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-[var(--afane-orange)] animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Aucun utilisateur trouvé
              </p>
            </div>
          ) : (
            <>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
                {users.length} résultat{users.length > 1 ? 's' : ''}
              </p>
              {users.map((user) => {
                const isCreating = creating === user.id;
                const isDisabled = creating !== null && !isCreating;
                const displayName =
                  user.display_name ||
                  (user.username ? `@${user.username}` : null) ||
                  'Utilisateur';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[var(--bg-hover)] active:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar_url}
                          alt={displayName}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-[var(--afane-green)] rounded-full flex items-center justify-center text-[var(--text-inverse)] font-semibold text-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                        {displayName}
                      </p>
                      {user.display_name && user.username && (
                        <p className="text-xs text-[var(--text-tertiary)] truncate">
                          @{user.username}
                        </p>
                      )}
                      {user.role && roleLabels[user.role] && (
                        <p className="text-[11px] text-[var(--afane-orange)] truncate">
                          {roleLabels[user.role]}
                        </p>
                      )}
                    </div>

                    {isCreating && (
                      <Loader2 className="h-5 w-5 text-[var(--afane-orange)] animate-spin flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
