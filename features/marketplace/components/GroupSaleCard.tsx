'use client';

import { useState } from 'react';
import {
  Users, TrendingDown, CheckCircle, Clock, Loader2,
  MessageCircle, User, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useGroupSale } from '../hooks/use-group-sale';
import { GroupParticipants } from './GroupParticipants';
import { getOrCreateConversation, groupChatService } from '@/features/messages';

interface GroupSaleCardProps {
  title: string;
  publicationId: string;
  basePrice: number;
  groupPrice: number;
  minQuantity: number;
  bulkDiscount: number;
  unit: string;
  sellerId: string;
}

export function GroupSaleCard({
  title,
  publicationId,
  basePrice,
  groupPrice,
  minQuantity,
  bulkDiscount,
  unit,
  sellerId,
}: GroupSaleCardProps) {
  const { profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  const { progress, participants, isParticipant, loading, join, leave } = useGroupSale(
    publicationId,
    profile?.id
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [groupChatLoading, setGroupChatLoading] = useState(false);

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

  const handleDirectChat = async () => {
    if (!profile?.id || profile.id === sellerId) return;
    setContactLoading(true);
    try {
      const convId = await getOrCreateConversation(profile.id, sellerId);
      router.push(`/${username}/messages?conversation=${convId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setContactLoading(false);
    }
  };

  /* ✅ Redirection vers le chat de groupe */
  const handleGroupChat = async () => {
    if (!profile?.id) return;
    setGroupChatLoading(true);
    try {
      const convId = await groupChatService.getOrCreate(publicationId);
      if (convId) {
        router.push(`/${username}/messages?conversation=${convId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGroupChatLoading(false);
    }
  };

  const currentQuantity = progress?.total_quantity || 0;
  const isComplete = progress?.is_complete || false;
  const percent = Math.min(100, (currentQuantity / minQuantity) * 100);
  const isSeller = profile?.id === sellerId;
  const savings = basePrice - groupPrice;
  const remaining = Math.max(0, minQuantity - currentQuantity);

  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-[var(--afane-orange)]/30 bg-[var(--bg-primary)] p-4 flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-[var(--afane-orange)] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl overflow-hidden border-2 border-[var(--afane-orange)]/30 bg-gradient-to-br from-[var(--afane-orange)]/5 to-transparent">

        {/* Header */}
        <div className="bg-[var(--afane-orange)] text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h3 className="font-bold text-sm">Vente groupée</h3>
            {isSeller && (
              <span className="ml-auto text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                Vendeur
              </span>
            )}
          </div>
          <p className="text-[11px] opacity-90 mt-0.5">
            {isSeller
              ? `${progress?.participants_count || 0} acheteur${(progress?.participants_count || 0) > 1 ? 's' : ''} intéressé${(progress?.participants_count || 0) > 1 ? 's' : ''}`
              : 'Rejoignez le groupe pour débloquer le prix réduit'}
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
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Liste des demandeurs */}
          {participants.length > 0 && (
            <div>
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] hover:text-[var(--afane-orange)] transition-colors py-1"
              >
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  Demandeurs ({participants.length})
                </span>
                {showAllMembers ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              {showAllMembers ? (
                <div className="mt-2">
                  <GroupParticipants
                    participants={participants}
                    currentUserId={profile?.id}
                    maxDisplay={50}
                  />
                </div>
              ) : (
                <div className="mt-1.5 flex items-center gap-1">
                  {participants.slice(0, 5).map((p, i) => (
                    <div
                      key={p.id}
                      className="w-7 h-7 rounded-full border-2 border-[var(--bg-primary)] -ml-1.5 first:ml-0 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                      style={{ zIndex: 10 - i }}
                      title={p.user?.display_name || 'Utilisateur'}
                    >
                      {p.user?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[var(--afane-green)] flex items-center justify-center">
                          {(p.user?.display_name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                  {participants.length > 5 && (
                    <div className="w-7 h-7 rounded-full -ml-1.5 bg-[var(--afane-orange)] flex items-center justify-center text-[9px] font-bold text-white">
                      +{participants.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
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
              Il manque {remaining.toFixed(0)} {unit} pour valider
            </div>
          )}

          {/* BOUTONS D'ACTION */}
          <div className="space-y-2">
            {/* Rejoindre / Quitter (acheteurs seulement) */}
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

            {/* Discuter avec le vendeur (direct) — masqué si vendeur */}
            {!isSeller && (
              <button
                onClick={handleDirectChat}
                disabled={contactLoading}
                className="w-full h-11 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-semibold rounded-full hover:bg-[var(--afane-green)] hover:text-white transition-colors disabled:opacity-50"
              >
                {contactLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                Discuter avec le vendeur
              </button>
            )}

            {/* Chat du groupe — visible par vendeur ET acheteurs */}
            <button
              onClick={handleGroupChat}
              disabled={groupChatLoading}
              className="w-full h-11 flex items-center justify-center gap-2 bg-[var(--afane-green)] text-white text-sm font-bold rounded-full hover:bg-[var(--afane-orange)] transition-colors disabled:opacity-50"
            >
              {groupChatLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              {isSeller ? 'Chat du groupe (acheteurs)' : 'Chat du groupe'}
              {(progress?.participants_count || 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                  {progress?.participants_count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

    </>
  );
}
