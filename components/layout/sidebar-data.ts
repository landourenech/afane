import {
  Home,
  Package,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  User,
  Settings,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/user";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export const menuItems: MenuItem[] = [
  // Essentiel pour tous
  { title: "Accueil", url: "", icon: Home },
  { title: "Explorer", url: "/explore", icon: Package },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  
  // Gestion des produits (tout le monde peut vendre)
  { title: "Mes Produits", url: "/products", icon: Package },
  { title: "Commandes", url: "/orders", icon: ShoppingCart },
  
  // Admin uniquement
  { title: "Utilisateurs", url: "/users", icon: Users, roles: ["admin"] },
  { title: "Statistiques", url: "/statistics", icon: BarChart3, roles: ["admin"] },
  
  // Bas de menu
  { title: "Mon Profil", url: "/profile", icon: User },
  { title: "Paramètres", url: "/settings", icon: Settings },
];