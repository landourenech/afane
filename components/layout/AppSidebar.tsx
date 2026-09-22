"use client";

import Image from "next/image";
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

import { LogOut } from "lucide-react";
import { SidebarMenuByRole } from "@/components/layout/sidebar-menu-by-role";

export function AppSidebar({ username }: { username: string }) {
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-[var(--color-primary)] p-0">
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

      <SidebarContent className="border-t-5 border-[var(--color-secondary)] pt-5">
        <SidebarMenuByRole
          role={profile?.role || "buyer"}
          username={username}
          variant="main"
        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuByRole
          role={profile?.role || "buyer"}
          username={username}
          variant="footer"
        />

        <SidebarMenu>
          <SidebarMenuItem>
            {/* ✅ Utiliser SidebarMenuButton directement avec onClick */}
            <SidebarMenuButton
              tooltip="Déconnexion"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
