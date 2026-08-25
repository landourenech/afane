import {
  Home,
  Users,
  ShoppingCart,
  BarChart3,
  User,
  MessageCircle,
  Truck,
  Headset,
  CirclePile,
  Package,
  Sprout,
  Store,
  ShieldCheck,
  Settings,
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
  { title: "Accueil", url: "", icon: Home },
  { title: "Utilisateurs", url: "/users", icon: Users, roles: ["admin"] },
  { title: "Produits", url: "/products", icon: Package, roles: ["admin", "producer", "cooperative"] },
  { title: "Commandes", url: "/orders", icon: ShoppingCart, roles: ["admin", "buyer", "supplier"] },
  { title: "Équipements", url: "/equipment", icon: Truck, roles: ["admin", "supplier"] },
  { title: "Conseils agricoles", url: "/advice", icon: Headset, roles: ["admin", "advisor"] },
  { title: "Ventes collectives", url: "/collaborative-sales", icon: CirclePile, roles: ["admin", "producer", "cooperative", "buyer"] },
  { title: "Achats groupés", url: "/group-purchases", icon: BarChart3, roles: ["admin", "producer", "cooperative"] },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Producteurs", url: "/farmers", icon: Sprout, roles: ["admin", "advisor", "buyer"] },
  { title: "Ventes", url: "/sales", icon: Store, roles: ["admin", "producer", "cooperative"] },
  { title: "Boutique", url: "/shop", icon: Store, roles: ["admin", "buyer", "supplier"] },
  { title: "Mes offres", url: "/offers", icon: Package, roles: ["admin", "producer", "supplier"] },
  { title: "Statistiques", url: "/statistics", icon: BarChart3, roles: ["admin"] },
  { title: "Mon profil", url: "/profile", icon: User },
  { title: "Administration", url: "/admin", icon: ShieldCheck, roles: ["admin"] },
  { title: "Paramètres", url: "/settings", icon: Settings },
];