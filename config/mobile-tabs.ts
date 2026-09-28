import {
  Home,
  Package,
  ShoppingCart,
  Compass,
  Heart,
  BookOpen,
  Map,
  Users,
  BarChart3,
  Settings,
  User,
  MessageCircle,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/user";

export interface MobileTab {
  title: string;
  url: string;
  icon: LucideIcon;
}

const TAB_HOME: MobileTab = { title: "Explore", url: "/explore", icon: Home };
const TAB_MESSAGES: MobileTab = { title: "Messages", url: "/messages", icon: MessageCircle };
const TAB_PROFILE: MobileTab = { title: "Paramètres", url: "/settings", icon: Settings };

// Partial : tous les rôles ne sont pas forcément listés
const TABS_BY_ROLE: Partial<Record<UserRole, [MobileTab, MobileTab]>> = {
  producer: [
    { title: "Produits",  url: "/products", icon: Package },
    { title: "Commandes", url: "/orders",   icon: ShoppingCart },
  ],
  cooperative: [
    { title: "Produits",  url: "/products", icon: Package },
    { title: "Commandes", url: "/orders",   icon: ShoppingCart },
  ],
  supplier: [
    { title: "Produits",  url: "/products", icon: Package },
    { title: "Commandes", url: "/orders",   icon: ShoppingCart },
  ],
  buyer: [
    { title: "Explorer", url: "/explore",   icon: Compass },
    { title: "Favoris",  url: "/favorites", icon: Heart },
  ],
  advisor: [
    { title: "Conseils", url: "/advice", icon: BookOpen },
    { title: "Carte",    url: "/map",    icon: Map },
  ],
  admin: [
    { title: "Users", url: "/users",      icon: Users },
    { title: "Stats", url: "/statistics", icon: BarChart3 },
  ],
};

// Fallback pour 'user' et tout rôle non listé
const DEFAULT_TABS: [MobileTab, MobileTab] = [
  { title: "Explorer",   url: "/explore",  icon: Compass },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function getMobileTabs(role: UserRole | undefined): MobileTab[] {
  const roleTabs = role && TABS_BY_ROLE[role]
    ? TABS_BY_ROLE[role]!
    : DEFAULT_TABS;

  return [TAB_HOME, roleTabs[0], roleTabs[1], TAB_MESSAGES, TAB_PROFILE];
}
