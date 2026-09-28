'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingDown, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GroupSaleCardProps {
  publicationId: string;
  basePrice: number;
  groupPrice: number;
  minQuantity: number;
  bulkDiscount: number;
  unit: string;
  sellerId: string;
  onJoinSuccess?: () => void;
}

export function GroupSaleCard({
  publicationId,
  basePrice,
  groupPrice,
  minQuantity,
  bulkDiscount,
  unit,
  sellerId,
  onJoinSuccess,
}: GroupSaleCardProps) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ participants: 0, totalQuantity: 0, isComplete: false });
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('group_sale_progress')
        .select('*')
        .eq('publication_id', publicationId)
        .maybeSingle();

      if (data) {
        setStats({
          participants: data.participants_count || 0,
          totalQuantity: data.total_quantity || 0,
          isComplete: data.is_complete || false,
        });
      }

      if (profile?.id) {
        const { data: participant } = await supabase
          .from('group_participants')
          .select('id')
          .eq('publication_id', publicationId)
          .eq('user_id', profile.id)
          .maybeSingle();
        setAlreadyJoined(!!participant);
      }

      setLoading(false);
    };
    load();
  }, [publicationId, profile?.id]);

  const handleJoin = async () => {
    if (!profile?.id) return;
    if (profile.id === sellerId) return;

    setJoining(true);
    const supabase = createClient();

    if (alreadyJoined) {
      await supabase.from('group_participants').delete()
        .eq('publication_id', publicationId)
        .eq('user_id', profile.id);
      setAlreadyJoined(false);
      setStats((s) => ({ ...s, participants: Math.max(0, s.participants - 1) }));
    } else {
      await supabase.from('group_participants').insert({
        publication_id: publicationId,
        user_id: profile.id,
        quantity: 1,
      });
      setAlreadyJoined(true);
      setStats((s) => ({ ...s, participants: s.participants + 1 }));
    }
    setJoining(false);
    onJoinSuccess?.();
  };

  const progress = Math.min(100, (stats.totalQuantity / minQuantity) * 100);
  const isSeller = profile?.id === sellerId;
  const savings = basePrice - groupPrice;

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
              {stats.participants} participant{stats.participants > 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-[var(--afane-orange)]">
              {stats.totalQuantity}/{minQuantity} {unit}
            </span>
          </div>
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--afane-orange)] to-[var(--afane-yellow)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Statut */}
        {stats.isComplete ? (
          <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-xl text-green-700 text-xs font-semibold">
            <CheckCircle className="h-4 w-4" />
            Groupe complet ! Prix débloqué
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 bg-[var(--bg-tertiary)] rounded-xl text-[var(--text-secondary)] text-xs">
            <Clock className="h-4 w-4" />
            Il manque {(minQuantity - stats.totalQuantity).toFixed(0)} {unit} pour valider
          </div>
        )}

        {/* Bouton */}
        {!isSeller && (
          <button
            onClick={handleJoin}
            disabled={joining || loading || stats.isComplete}
            className={`w-full h-11 rounded-full font-bold text-sm transition-all active:scale-[0.98] ${
              stats.isComplete
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : alreadyJoined
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-red-100 hover:text-red-600'
                : 'bg-[var(--afane-orange)] text-white hover:opacity-90'
            }`}
          >
            {joining || loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {alreadyJoined ? 'Retrait...' : 'Adhésion...'}
              </span>
            ) : stats.isComplete ? (
              '✅ Groupe complet'
            ) : alreadyJoined ? (
              'Quitter le groupe'
            ) : (
              '🛒 Rejoindre le groupe'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
