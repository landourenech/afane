import {
  Home,
  Package,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  User,
  Settings,
  Map,
  BookOpen,
  Users,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/types/user';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation publique
export const publicNav: NavItem[] = [
  { title: 'Accueil', href: '/', icon: Home },
  { title: 'Boutique', href: '/boutique', icon: Package },
  { title: 'Carte', href: '/carte', icon: Map },
  { title: 'Conseils', href: '/conseil', icon: BookOpen },
  { title: 'À propos', href: '/apropos', icon: Users },
];

// Navigation dashboard
export const dashboardNav: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { title: 'Tableau de bord', href: '/dashboard', icon: Home },
      { title: 'Publier', href: '/produits/nouveau', icon: Plus },
    ],
  },
  {
    title: 'Activité',
    items: [
      { title: 'Mes produits', href: '/produits', icon: Package },
      { title: 'Commandes', href: '/commandes', icon: ShoppingCart },
      { title: 'Messages', href: '/messages', icon: MessageCircle },
    ],
  },
  {
    title: 'Compte',
    items: [
      { title: 'Mon profil', href: '/profil', icon: User },
      { title: 'Paramètres', href: '/parametres', icon: Settings },
    ],
  },
];

// Navigation admin
export const adminNav: NavSection[] = [
  {
    title: 'Administration',
    items: [
      { title: 'Tableau de bord', href: '/admin', icon: BarChart3 },
      { title: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
      { title: 'Statistiques', href: '/admin/statistiques', icon: BarChart3 },
    ],
  },
];
