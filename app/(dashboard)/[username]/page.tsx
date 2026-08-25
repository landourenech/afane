'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Package, ShoppingCart, TrendingUp, MessageCircle,
  BookOpen, Map, BarChart3, Sprout, Store, Truck,
  CirclePile, ChevronRight, AlertCircle, Clock, CheckCircle
} from 'lucide-react';

// Configuration par rôle (comme avant)
const ROLE_MODULES = {
  producer: {
    welcome: 'Espace Producteur',
    modules: [
      { title: 'Mes Produits', icon: Package, href: 'products', description: 'Gérer vos produits' },
      { title: 'Ventes Collectives', icon: CirclePile, href: 'collective-sales', description: 'Ventes groupées' },
      { title: 'Achats Groupés', icon: ShoppingCart, href: 'group-purchases', description: 'Achats groupés' },
      { title: 'Conseils', icon: BookOpen, href: 'advice', description: 'Conseils agricoles' },
      { title: 'Messages', icon: MessageCircle, href: 'messages', description: 'Messagerie' },
    ],
  },
  cooperative: {
    welcome: 'Espace Coopérative',
    modules: [
      { title: 'Membres', icon: Users, href: 'members', description: 'Gérer les membres' },
      { title: 'Produits', icon: Package, href: 'products', description: 'Produits collectifs' },
      { title: 'Ventes Collectives', icon: CirclePile, href: 'collective-sales', description: 'Ventes groupées' },
      { title: 'Achats Groupés', icon: ShoppingCart, href: 'group-purchases', description: 'Achats groupés' },
      { title: 'Messages', icon: MessageCircle, href: 'messages', description: 'Messagerie' },
    ],
  },
  buyer: {
    welcome: 'Espace Acheteur',
    modules: [
      { title: 'Rechercher', icon: Store, href: 'products', description: 'Trouver des produits' },
      { title: 'Mes Commandes', icon: ShoppingCart, href: 'orders', description: 'Suivre les commandes' },
      { title: 'Producteurs', icon: Sprout, href: 'farmers', description: 'Voir les producteurs' },
      { title: 'Messages', icon: MessageCircle, href: 'messages', description: 'Messagerie' },
    ],
  },
  supplier: {
    welcome: 'Espace Fournisseur',
    modules: [
      { title: 'Mes Intrants', icon: Package, href: 'products', description: 'Catalogue' },
      { title: 'Achats Groupés', icon: ShoppingCart, href: 'group-purchases', description: 'Demandes' },
      { title: 'Commandes', icon: Truck, href: 'orders', description: 'Gérer les commandes' },
      { title: 'Messages', icon: MessageCircle, href: 'messages', description: 'Messagerie' },
    ],
  },
  advisor: {
    welcome: 'Espace Conseiller',
    modules: [
      { title: 'Publier', icon: BookOpen, href: 'advice/new', description: 'Partager expertise' },
      { title: 'Producteurs', icon: Sprout, href: 'farmers', description: 'Voir les producteurs' },
      { title: 'Messages', icon: MessageCircle, href: 'messages', description: 'Répondre' },
    ],
  },
  admin: {
    welcome: 'Administration',
    modules: [
      { title: 'Utilisateurs', icon: Users, href: 'users', description: 'Gérer les utilisateurs' },
      { title: 'Produits', icon: Package, href: 'products', description: 'Gérer les produits' },
      { title: 'Commandes', icon: ShoppingCart, href: 'orders', description: 'Gérer les commandes' },
      { title: 'Producteurs', icon: Sprout, href: 'farmers', description: 'Gérer les producteurs' },
      { title: 'Statistiques', icon: BarChart3, href: 'statistics', description: 'Statistiques' },
    ],
  },
};

export default function UsernameDashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (!loading && user && !profile?.onboarding_completed) {
      router.push('/onboarding');
    }
  }, [user, profile, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const role = profile?.role || 'user';
  const roleConfig = ROLE_MODULES[role as keyof typeof ROLE_MODULES] || { welcome: 'Bienvenue', modules: [] };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-[var(--color-quaternary)] to-[var(--color-secondary)] p-6 text-white">
        <h1 className="text-2xl font-bold">{roleConfig.welcome}</h1>
        <p className="mt-1 opacity-90">@{username}</p>
        <p className="mt-2 text-sm opacity-75">
          {profile?.display_name || user.displayName || user.email}
        </p>
      </div> */}

      <div className="p-6">
        {/* Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleConfig.modules.map((module) => (
            <Link
              key={module.title}
              href={`/${username}/${module.href}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-start">
                <div className="p-3 bg-[var(--color-secondary)]/10 rounded-lg">
                  <module.icon className="h-6 w-6 text-[var(--color-secondary)]" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}