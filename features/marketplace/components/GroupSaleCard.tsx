'use client';

import { useState } from 'react';
import { Users, TrendingDown, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupSale } from '../hooks/use-group-sale';
import { GroupParticipants } from './GroupParticipants';

interface GroupSaleCardProps {
  publicationId: string;
  basePrice: number;
  groupPrice: number;
  minQuantity: number;
  bulkDiscount: number;
  unit: string;
  sellerId: string;
}

export function GroupSaleCard({
  publicationId,
  basePrice,
  groupPrice,
  minQuantity,
  bulkDiscount,
  unit,
  sellerId,
}: GroupSaleCardProps) {
  const { profile } = useAuth();
  const { progress, participants, isParticipant, loading, join, leave } = useGroupSale(
    publicationId,
    profile?.id
  );
  const [actionLoading, setActionLoading] = useState(false);

  const handleToggle = async () => {
    if (!profile?.id) return;
    setActionLoading(true);
    if (isParticipant) {
      await leave();
    } else {
      await join(1);
    }
    setActionLoading(false);
  };

  const currentQuantity = progress?.total_quantity || 0;
  const isComplete = progress?.is_complete || false;
  const progress_percent = Math.min(100, (currentQuantity / minQuantity) * 100);
  const isSeller = profile?.id === sellerId;
  const savings = basePrice - groupPrice;

  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-[var(--afane-orange)]/30 bg-[var(--bg-primary)] p-4 flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-[var(--afane-orange)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[var(--afane-orange)]/30 bg-gradient-to-br from-[var(--afane-orange)]/5 to-transparent">
      {/* Header */}
      <div className="bg-[var(--afane-orange)] text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="font-bold text-sm">Vente groupée</h3>
        </div>
        <p className="text-[11px] opacity-90 mt-0.5">
          Rejoignez le groupe pour débloquer le prix réduit
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Prix */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Prix normal</p>
            <p className="text-sm line-through text-[var(--text-tertiary)]">
              {basePrice.toLocaleString('fr-FR')} F/{unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--afane-orange)] uppercase tracking-wider font-bold">Prix groupé</p>
            <p className="text-2xl font-bold text-[var(--afane-orange)]">
              {groupPrice.toLocaleString('fr-FR')} F
              <span className="text-xs font-normal text-[var(--text-tertiary)]">/{unit}</span>
            </p>
          </div>
        </div>

        {/* Économie */}
        {savings > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full w-fit">
            <TrendingDown className="h-3 w-3" />
            Économisez {savings.toLocaleString('fr-FR')} F ({bulkDiscount}%)
          </div>
        )}

        {/* Progression */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)]">
              {progress?.participants_count || 0} participant{(progress?.participants_count || 0) > 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-[var(--afane-orange)]">
              {currentQuantity}/{minQuantity} {unit}
            </span>
          </div>
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--afane-orange)] to-[var(--afane-yellow)] rounded-full transition-all duration-500"
              style={{ width: `${progress_percent}%` }}
            />
          </div>
        </div>

        {/* Participants */}
        {participants.length > 0 && (
          <GroupParticipants
            participants={participants}
            currentUserId={profile?.id}
            maxDisplay={3}
          />
        )}

        {/* Statut */}
        {isComplete ? (
          <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-xl text-green-700 text-xs font-semibold">
            <CheckCircle className="h-4 w-4" />
            Groupe complet ! Prix débloqué
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 bg-[var(--bg-tertiary)] rounded-xl text-[var(--text-secondary)] text-xs">
            <Clock className="h-4 w-4" />
            Il manque {(minQuantity - currentQuantity).toFixed(0)} {unit} pour valider
          </div>
        )}

        {/* Bouton */}
        {!isSeller && (
          <button
            onClick={handleToggle}
            disabled={actionLoading || isComplete}
            className={`w-full h-11 rounded-full font-bold text-sm transition-all active:scale-[0.98] ${
              isComplete
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : isParticipant
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-red-100 hover:text-red-600'
                : 'bg-[var(--afane-orange)] text-white hover:opacity-90'
            }`}
          >
            {actionLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isParticipant ? 'Retrait...' : 'Adhésion...'}
              </span>
            ) : isComplete ? (
              '✅ Groupe complet'
            ) : isParticipant ? (
              'Quitter le groupe'
            ) : (
              '🛒 Rejoindre le groupe'
            )}
          </button>
        )}

        {/* Info vendeur */}
        {isSeller && (
          <p className="text-[11px] text-center text-[var(--text-tertiary)] italic">
            Vous êtes le vendeur de ce groupe
          </p>
        )}
      </div>
    </div>
  );
}
