'use client';

import { useState } from 'react';
import { X, TrendingDown, Users, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { proposalService } from '../services/proposal.service';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication: {
    id: string;
    title: string;
    price: number;
    unit: string;
  };
  onSuccess?: () => void;
}

export function ProposalModal({
  isOpen,
  onClose,
  publication,
  onSuccess,
}: ProposalModalProps) {
  const { profile } = useAuth();
  const [proposedPrice, setProposedPrice] = useState(
    Math.round(publication.price * 0.85)
  );
  const [minQuantity, setMinQuantity] = useState(10);
  const [message, setMessage] = useState('');
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const discount = Math.round(
    ((publication.price - proposedPrice) / publication.price) * 100
  );

  const handleSubmit = async () => {
    if (!profile?.id) return;
    if (proposedPrice >= publication.price) {
      setError('Le prix proposé doit être inférieur au prix actuel');
      return;
    }
    if (minQuantity < 2) {
      setError('La quantité minimale doit être au moins 2');
      return;
    }

    setLoading(true);
    setError('');

    const result = await proposalService.create({
      publication_id: publication.id,
      proposer_id: profile.id,
      proposed_price: proposedPrice,
      min_quantity: minQuantity,
      message: message.trim() || undefined,
      deadline_days: deadlineDays,
    });

    setLoading(false);

    if (result) {
      onSuccess?.();
      onClose();
    } else {
      setError('Erreur lors de la création de la proposition');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:max-w-md md:rounded-2xl bg-[var(--bg-primary)] rounded-t-3xl md:rounded-b-2xl shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)]">
          <div className="p-2 bg-[var(--afane-orange)]/10 rounded-xl">
            <Users className="h-5 w-5 text-[var(--afane-orange)]" />
          </div>
          <h2 className="flex-1 font-bold text-[var(--text-primary)] text-base">
            Proposer une vente collective
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-hover)]">
            <X className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl">
            <p className="text-xs text-[var(--text-tertiary)] mb-1">Produit</p>
            <p className="font-semibold text-sm text-[var(--text-primary)]">
              {publication.title}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Prix actuel : <span className="font-bold text-[var(--afane-green)]">
                {publication.price.toLocaleString('fr-FR')} F/{publication.unit}
              </span>
            </p>
          </div>

          {/* Prix proposé */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Prix de groupe proposé (FCFA/{publication.unit})
            </label>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(Number(e.target.value))}
              min={0}
              max={publication.price - 1}
              className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            />
            {discount > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full w-fit">
                <TrendingDown className="h-3 w-3" />
                Réduction de {discount}%
              </div>
            )}
          </div>

          {/* Quantité minimale */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Quantité minimale pour valider ({publication.unit})
            </label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(Number(e.target.value))}
              min={2}
              className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            />
          </div>

          {/* Délai */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Durée de la proposition (jours)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDeadlineDays(d)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors ${
                    deadlineDays === d
                      ? 'bg-[var(--afane-orange)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--afane-orange)]/10'
                  }`}
                >
                  {d}j
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Message au vendeur (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Expliquez votre proposition..."
              className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          {/* Info */}
          <div className="p-3 bg-[var(--afane-orange)]/5 rounded-xl text-xs text-[var(--text-secondary)]">
            💡 Le vendeur recevra votre proposition. S'il l'accepte, le produit deviendra
            une vente collective et d'autres acheteurs pourront rejoindre le groupe.
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-[var(--border-primary)]">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-semibold rounded-full hover:bg-[var(--border-secondary)]"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-11 bg-[var(--afane-orange)] text-white text-sm font-bold rounded-full hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Proposer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
