'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  orderNumber: string;
}

const REASONS = [
  'Je ne veux plus de cette commande',
  'J\'ai trouvé un meilleur prix',
  'Délai de livraison trop long',
  'Erreur dans ma commande',
  'Autre raison',
];

export function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const reason = selectedReason === 'Autre raison'
      ? customReason
      : selectedReason;

    if (!reason) {
      setError('Sélectionnez une raison');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm(reason);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full md:max-w-md md:rounded-2xl bg-[var(--bg-primary)] rounded-t-3xl md:rounded-b-2xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[70vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="flex-1 font-bold text-[var(--text-primary)] text-base">
            Annuler la commande
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)]"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Commande <span className="font-mono font-semibold text-[var(--afane-green)]">{orderNumber}</span>
          </p>

          <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
            Pourquoi annulez-vous ?
          </p>

          <div className="space-y-1.5">
            {REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedReason === reason
                    ? 'border-[var(--afane-orange)] bg-[var(--afane-orange)]/5'
                    : 'border-[var(--border-primary)] hover:border-[var(--afane-orange)]/50'
                }`}
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="accent-[var(--afane-orange)]"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          {selectedReason === 'Autre raison' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Précisez votre raison..."
              rows={3}
              className="w-full mt-3 px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30 resize-none"
            />
          )}

          {error && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-[var(--border-primary)] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-semibold rounded-full hover:bg-[var(--border-secondary)] transition-colors"
          >
            Retour
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !selectedReason}
            className="flex-1 h-11 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Annulation...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}
