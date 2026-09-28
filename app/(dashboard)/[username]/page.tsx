'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  MessageCircle,
  Bell,
  TrendingUp,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats';
import { getMobileTabs } from '@/config/mobile-tabs';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  const { user, profile } = useAuth();
  const { stats, loading } = useDashboardStats(profile?.id, profile?.role);

  const firstName = profile?.display_name?.split(' ')[0] || 'Utilisateur';
  const roleTabs = getMobileTabs(profile?.role);

  const roleLabels: Record<string, string> = {
    producer: 'Producteur',
    cooperative: 'Coopérative',
    buyer: 'Acheteur',
    supplier: 'Fournisseur',
    advisor: 'Conseiller',
    admin: 'Administrateur',
    user: 'Utilisateur',
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ═══════════════════════════════════════
          WELCOME BANNER
          ═══════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-[#0c4428] via-[#0c4428] to-[#e86c00] px-4 py-6 md:rounded-b-3xl md:mx-4 md:mt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/70 font-medium mb-1">
              {roleLabels[profile?.role || 'user']} · AFANE
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 truncate">
              Bonjour, {firstName} 👋
            </h1>
            <p className="text-sm text-white/80">
              Bienvenue sur votre tableau de bord
            </p>
          </div>

          <Link
            href={`/${username}/notifications`}
            className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <Bell className="h-5 w-5 text-white" />
            {!loading && stats.notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {stats.notifications > 9 ? '9+' : stats.notifications}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS CARDS
          ═══════════════════════════════════════ */}
      <div className="px-4 -mt-4 md:mt-6">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <StatCard
            label="Produits"
            value={loading ? '—' : stats.products}
            icon={Package}
            color="blue"
            href={`/${username}/products`}
          />
          <StatCard
            label="Commandes"
            value={loading ? '—' : stats.orders}
            icon={ShoppingCart}
            color="purple"
            href={`/${username}/orders`}
          />
          <StatCard
            label="Messages"
            value={loading ? '—' : stats.messages}
            icon={MessageCircle}
            color="green"
            href={`/${username}/messages`}
          />
          <StatCard
            label="Notifications"
            value={loading ? '—' : stats.notifications}
            icon={Bell}
            color="orange"
            href={`/${username}/notifications`}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ACTIONS RAPIDES
          ═══════════════════════════════════════ */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#e86c00]" />
            Actions rapides
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(profile?.role === 'producer' ||
            profile?.role === 'cooperative' ||
            profile?.role === 'supplier') && (
            <QuickAction
              title="Publier un produit"
              subtitle="Ajouter une annonce"
              icon={Plus}
              href={`/${username}/products/publish`}
              color="orange"
            />
          )}

          <QuickAction
            title="Explorer"
            subtitle="Découvrir"
            icon={TrendingUp}
            href={`/${username}/explore`}
            color="green"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════
          NAVIGATION RAPIDE (selon rôle)
          ═══════════════════════════════════════ */}
      <div className="px-4 mt-6 pb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Accès rapide
        </h2>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {roleTabs
            .filter((tab) => tab.url !== '' && tab.title !== 'Profil')
            .map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.title}
                  href={`/${username}${tab.url}`}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-[#e86c00]/10 text-[#e86c00]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1 font-medium text-gray-900 text-sm">
                    {tab.title}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SOUS-COMPOSANTS
// ══════════════════════════════════════════════════════════

import type { LucideIcon } from 'lucide-react';

const statColors = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: keyof typeof statColors;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all"
    >
      <div className={`inline-flex p-2 rounded-lg ${statColors[color]} mb-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none">
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1.5">{label}</p>
    </Link>
  );
}

const actionColors = {
  orange: 'bg-[#e86c00] text-white',
  green:  'bg-[#0c4428] text-white',
};

function QuickAction({
  title,
  subtitle,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
  color: keyof typeof actionColors;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl p-4 active:scale-[0.98] transition-transform ${actionColors[color]}`}
    >
      <Icon className="h-6 w-6 mb-3" />
      <p className="font-bold text-sm leading-tight">{title}</p>
      <p className="text-xs opacity-80 mt-0.5">{subtitle}</p>
    </Link>
  );
}
