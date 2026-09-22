'use client';

import { useParams } from 'next/navigation';
import { Package, ShoppingCart, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats';

export default function DashboardPage() {
  const params = useParams();
  const username = params?.username as string;
  const { user, profile } = useAuth();
  const { stats, loading } = useDashboardStats(user?.uid, profile?.role);

  const firstName = profile?.display_name?.split(' ')[0] || 'Utilisateur';

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-[#0c4428] to-[#e86c00] rounded-2xl p-6 text-white">
        <p className="text-sm opacity-90 mb-1">Bonjour 👋</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{firstName}</h1>
        <p className="text-sm opacity-90">{profile?.role || 'Utilisateur'} · AFANE</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Produits"
          value={loading ? '...' : stats.products}
          icon={Package}
          color="blue"
        />
        <StatCard
          label="Commandes"
          value={loading ? '...' : stats.orders}
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          label="Messages"
          value={loading ? '...' : stats.messages}
          icon={MessageCircle}
          color="green"
        />
        <StatCard
          label="Notifications"
          value={loading ? '...' : stats.notifications}
          icon={Bell}
          color="orange"
        />
      </div>
    </div>
  );
}

// ── StatCard inline (temporaire, à extraire plus tard) ──
import type { LucideIcon } from 'lucide-react';

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: keyof typeof colorClasses;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
