"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { mainMenuItems, footerMenuItems } from "@/components/layout/sidebar-data";
import type { UserRole } from "@/types/user";

interface SidebarMenuByRoleProps {
  username: string;
  role: UserRole;
  variant?: "main" | "footer";
}

export function SidebarMenuByRole({
  username,
  role,
  variant = "main",
}: SidebarMenuByRoleProps) {
  const pathname = usePathname();

  const source = variant === "main" ? mainMenuItems : footerMenuItems;

  const filteredItems = source.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const href =
          item.url === "" ? `/${username}` : `/${username}${item.url}`;

        const isActive =
          item.url === ""
            ? pathname === `/${username}`
            : pathname.startsWith(href);

        return (
          <SidebarMenuItem key={item.title}>
            <Link href={href} className="w-full">
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={
                  isActive
                    ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"
                    : ""
                }
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
