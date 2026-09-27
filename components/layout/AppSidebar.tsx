"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Settings, CircleQuestionMark, LogOut, User } from "lucide-react";
import { SidebarMenuByRole } from "@/components/layout/sidebar-menu-by-role";

export function AppSidebar({ username }: { username: string }) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header — fond blanc avec logo */}
      <SidebarHeader className="bg-white p-0">
        <div className="flex h-16 items-center justify-center">
          <Image
            src="/logo.png"
            width={80}
            height={70}
            alt="AFANE"
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </SidebarHeader>

      {/* Content — navigation selon rôle */}
      <SidebarContent className="border-t-4 border-[var(--afane-orange)] pt-4">
        <SidebarMenuByRole
          role={profile?.role || "buyer"}
          username={username}
        />
      </SidebarContent>

      {/* Footer — paramètres, aide, profil, déconnexion */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={`/${username}/settings`} className="block w-full">
              <SidebarMenuButton tooltip="Paramètres">
                <Settings />
                <span>Paramètres</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/help" className="block w-full">
              <SidebarMenuButton tooltip="Aide">
                <CircleQuestionMark />
                <span>Aide</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href={`/${username}/profile`} className="block w-full">
              <SidebarMenuButton tooltip="Mon profil">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || "User"}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="truncate">
                  {profile?.display_name || user?.displayName || "Profil"}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Déconnexion" onClick={handleLogout}>
              <LogOut />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
