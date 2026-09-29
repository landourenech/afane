'use client';

import { useState } from 'react';
import { Check, X, Clock, TrendingDown, Users, Loader2 } from 'lucide-react';
import { proposalService, type GroupProposal } from '../services/proposal.service';
import { useReceivedProposals } from '../hooks/use-proposals';

interface ProposalsListProps {
  userId: string | undefined;
  onAccept?: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
  accepted:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Acceptée' },
  rejected:  { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Refusée' },
  expired:   { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'Expirée' },
  completed: { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Complétée' },
};

export function ProposalsList({ userId, onAccept }: ProposalsListProps) {
  const { proposals, loading, refresh } = useReceivedProposals(userId);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setActionLoading(id);
    const ok = await proposalService.accept(id);
    setActionLoading(null);
    if (ok) {
      await refresh();
      onAccept?.();
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    const ok = await proposalService.reject(id);
    setActionLoading(null);
    if (ok) await refresh();
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border-primary)]">
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 text-[var(--afane-orange)] animate-spin" />
        </div>
      </div>
    );
  }

  if (proposals.length === 0) return null;

  const pending = proposals.filter((p) => p.status === 'pending').length;

  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-[var(--afane-orange)]" />
          <h3 className="font-bold text-sm text-[var(--text-primary)]">
            Propositions reçues
          </h3>
          {pending > 0 && (
            <span className="px-2 py-0.5 bg-[var(--afane-orange)] text-white text-[10px] font-bold rounded-full">
              {pending}
            </span>
          )}
        </div>
      </div>

      {/* Liste */}
      <div className="divide-y divide-[var(--border-primary)]">
        {proposals.map((p) => {
          const style = STATUS_STYLES[p.status] || STATUS_STYLES.pending;
          const pub = (p as any).publication;
          const proposer = p.proposer;
          const isPending = p.status === 'pending';

          return (
            <div key={p.id} className="p-4 space-y-3">
              {/* Proposeur */}
              <div className="flex items-center gap-3">
                {proposer?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proposer.avatar_url}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-white text-xs font-bold">
                    {(proposer?.display_name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {proposer?.display_name || 'Utilisateur'}
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                    @{proposer?.username} · {new Date(p.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>

              {/* Produit concerné */}
              {pub && (
                <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-xl">
                  <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">
                    Produit
                  </p>
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {pub.title}
                  </p>
                </div>
              )}

              {/* Proposition */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[var(--afane-orange)]/5 rounded-xl">
                  <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                    Prix proposé
                  </p>
                  <p className="font-bold text-[var(--afane-orange)] mt-0.5">
                    {p.proposed_price.toLocaleString('fr-FR')} F
                  </p>
                </div>
                <div className="p-2.5 bg-[var(--afane-green)]/5 rounded-xl">
                  <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                    Qté minimum
                  </p>
                  <p className="font-bold text-[var(--afane-green)] mt-0.5">
                    {p.min_quantity} u.
                  </p>
                </div>
              </div>

              {p.message && (
                <p className="text-xs text-[var(--text-secondary)] italic bg-[var(--bg-tertiary)] p-2.5 rounded-xl">
                  « {p.message} »
                </p>
              )}

              {/* Actions */}
              {isPending && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleReject(p.id)}
                    disabled={actionLoading === p.id}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full hover:bg-red-100 disabled:opacity-50"
                  >
                    {actionLoading === p.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    Refuser
                  </button>
                  <button
                    onClick={() => handleAccept(p.id)}
                    disabled={actionLoading === p.id}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-[var(--afane-green)] text-white text-xs font-bold rounded-full hover:bg-[var(--afane-orange)] disabled:opacity-50"
                  >
                    {actionLoading === p.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Accepter
                  </button>
                </div>
              )}

              {/* Statut non-pending */}
              {!isPending && (
                <div className={`flex items-center gap-2 p-2 rounded-xl text-xs ${style.bg} ${style.text}`}>
                  <Clock className="h-3.5 w-3.5" />
                  Proposition {style.label.toLowerCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
