'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  CooperativeList,
  CreateCooperativeModal,
  useCooperatives,
} from '@/features/cooperatives';

type Tab = 'all' | 'mine';

export default function CooperativesPage() {
  const params = useParams();
  const username = params?.username as string;
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('all');
  const [createOpen, setCreateOpen] = useState(false);

  const { cooperatives, myCooperatives, loading, refresh } = useCooperatives(profile?.id);

  const displayed = tab === 'mine' ? myCooperatives : cooperatives;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--afane-green)] flex items-center gap-2">
            <Users className="h-7 w-7" />
            Coopératives
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Regroupez-vous et vendez ensemble
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex-shrink-0 h-11 px-4 flex items-center gap-2 bg-[var(--afane-green)] text-white text-sm font-bold rounded-full hover:bg-[var(--afane-orange)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Créer</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-[var(--bg-tertiary)] rounded-full w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
            tab === 'all'
              ? 'bg-[var(--afane-green)] text-white'
              : 'text-[var(--text-secondary)] hover:text-[var(--afane-orange)]'
          }`}
        >
          Toutes ({cooperatives.length})
        </button>
        <button
          onClick={() => setTab('mine')}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
            tab === 'mine'
              ? 'bg-[var(--afane-green)] text-white'
              : 'text-[var(--text-secondary)] hover:text-[var(--afane-orange)]'
          }`}
        >
          Mes coopératives ({myCooperatives.length})
        </button>
      </div>

      {/* Liste */}
      <CooperativeList
        cooperatives={displayed}
        loading={loading}
        username={username}
        emptyMessage={
          tab === 'mine'
            ? "Vous n'avez rejoint aucune coopérative"
            : 'Aucune coopérative'
        }
      />

      {/* Modal */}
      <CreateCooperativeModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
}
