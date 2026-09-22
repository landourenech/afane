import {
  Home,
  Compass,
  Package,
  ShoppingCart,
  MessageCircle,
  Users,
  BarChart3,
  Settings,
  User,
  Heart,
  BookOpen,
  Map,
  Bell,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/user";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

// ══════════════════════════════════════════════════════════
// NAVIGATION PRINCIPALE
// ══════════════════════════════════════════════════════════

export const mainMenuItems: MenuItem[] = [
  // Universel
  { title: "Accueil", url: "", icon: Home },
  { title: "Explorer", url: "/explore", icon: Compass },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Notifications", url: "/notifications", icon: Bell },

  // Producteur / Coopérative / Fournisseur
  { 
    title: "Mes Produits", 
    url: "/products", 
    icon: Package,
    roles: ["producer", "cooperative", "supplier"],
  },
  { 
    title: "Commandes", 
    url: "/orders", 
    icon: ShoppingCart,
    roles: ["producer", "cooperative", "supplier", "buyer"],
  },

  // Conseiller
  { 
    title: "Conseils", 
    url: "/advice", 
    icon: BookOpen,
    roles: ["advisor", "producer", "cooperative"],
  },
  { 
    title: "Carte agricole", 
    url: "/map", 
    icon: Map,
    roles: ["advisor", "producer", "cooperative", "admin"],
  },

  // Acheteur
  { 
    title: "Favoris", 
    url: "/favorites", 
    icon: Heart,
    roles: ["buyer"],
  },

  // Admin
  { 
    title: "Utilisateurs", 
    url: "/users", 
    icon: Users,
    roles: ["admin"],
  },
  { 
    title: "Statistiques", 
    url: "/statistics", 
    icon: BarChart3,
    roles: ["admin"],
  },
];

// ══════════════════════════════════════════════════════════
// NAVIGATION SECONDAIRE (Footer)
// ══════════════════════════════════════════════════════════

export const footerMenuItems: MenuItem[] = [
  { title: "Mon Profil", url: "/profile", icon: User },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

// ══════════════════════════════════════════════════════════
// Rétrocompatibilité (pour ne rien casser)
// ══════════════════════════════════════════════════════════

export const menuItems: MenuItem[] = [
  ...mainMenuItems,
  ...footerMenuItems,
];
