import { Home, Package, ShoppingCart, MessageCircle } from 'lucide-react';

export const mainNav = [
  { title: 'Accueil', href: '/', icon: Home },
  { title: 'Boutique', href: '/boutique', icon: ShoppingCart },
  { title: 'Carte', href: '/carte', icon: Package },
  { title: 'Conseils', href: '/conseil', icon: MessageCircle },
];

export const dashboardNav = [
  { title: 'Tableau de bord', href: '/dashboard', icon: Home },
  { title: 'Produits', href: '/produits', icon: Package },
  { title: 'Commandes', href: '/commandes', icon: ShoppingCart },
];