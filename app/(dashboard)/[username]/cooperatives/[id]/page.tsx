'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Users, MapPin, Phone, Mail, Package,
  Calendar, Crown, Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  JoinButton,
  MembersList,
  useCooperativeDetail,
} from '@/features/cooperatives';
import { GroupChatPanel } from '@/features/messages';
import { MessageCircle } from 'lucide-react';

export default function CooperativeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  const cooperativeId = params?.id as string;
  const { profile } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  const {
    cooperative,
    members,
    isMember,
    myRole,
    loading,
    join,
    leave,
  } = useCooperativeDetail(cooperativeId, profile?.id);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[var(--afane-orange)] animate-spin" />
      </div>
    );
  }

  if (!cooperative) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Coopérative introuvable
          </p>
          <Link
            href={`/${username}/cooperatives`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--afane-green)] text-white text-sm font-semibold rounded-full hover:bg-[var(--afane-orange)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </div>
    );
  }

  const isPresident = myRole === 'president';

  return (
    <div className="min-h-full bg-[var(--bg-secondary)]">
      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-base font-semibold truncate">
            {cooperative.name}
          </h1>
          <button
            onClick={() => setChatOpen(true)}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            title="Chat coopérative"
          >
            <MessageCircle className="h-5 w-5 text-[var(--afane-green)]" />
          </button>
          {isPresident && (
            <span className="text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              <Crown className="inline h-3 w-3 mr-1" />
              Président
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Header coop */}
        <div className="bg-[var(--bg-primary)] rounded-2xl overflow-hidden border border-[var(--border-primary)]">
          <div className="aspect-[3/1] bg-gradient-to-br from-[var(--afane-green)] to-[var(--afane-green)]/70 relative">
            {cooperative.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cooperative.cover_url} alt="" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-5 pb-5 -mt-12 relative">
            <div className="w-20 h-20 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--afane-green)] flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
              {cooperative.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cooperative.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                cooperative.name.charAt(0).toUpperCase()
              )}
            </div>

            <h2 className="font-bold text-xl text-[var(--text-primary)] mt-3">
              {cooperative.name}
            </h2>

            {cooperative.description && (
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                {cooperative.description}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-[var(--afane-green)]/5 rounded-xl">
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                  Membres
                </p>
                <p className="text-lg font-bold text-[var(--afane-green)] mt-1">
                  {cooperative.member_count}
                </p>
              </div>
              <div className="p-3 bg-[var(--afane-orange)]/5 rounded-xl">
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                  Produits
                </p>
                <p className="text-lg font-bold text-[var(--afane-orange)] mt-1">
                  {cooperative.product_count}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-4 space-y-2">
              {cooperative.city && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--afane-orange)]" />
                  {cooperative.city}{cooperative.region && `, ${cooperative.region}`}
                </div>
              )}
              {cooperative.phone && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Phone className="h-3.5 w-3.5 text-[var(--afane-orange)]" />
                  {cooperative.phone}
                </div>
              )}
              {cooperative.email && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Mail className="h-3.5 w-3.5 text-[var(--afane-orange)]" />
                  {cooperative.email}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 space-y-2">
              {profile?.id !== cooperative.created_by && (
                <JoinButton
                  isMember={isMember}
                  onJoin={join}
                  onLeave={leave}
                  canLeave={!isPresident}
                />
              )}
              <button
                onClick={() => setChatOpen(true)}
                className="w-full h-11 flex items-center justify-center gap-2 bg-[var(--afane-green)] text-white text-sm font-bold rounded-full hover:bg-[var(--afane-orange)] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Ouvrir le chat de la coopérative
              </button>
            </div>
          </div>
        </div>

        {/* Membres */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4">
          <MembersList
            members={members}
            currentUserId={profile?.id}
          />
        </div>
      </div>

      {chatOpen && (
        <GroupChatPanel
          cooperativeId={cooperative.id}
          publicationTitle={cooperative.name}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
