'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { menuItems } from './sidebar-data';
import type { UserRole } from '@/types/user';

interface SidebarMenuByRoleProps {
  username: string;
  role: UserRole;
}

export function SidebarMenuByRole({ username, role }: SidebarMenuByRoleProps) {
  const pathname = usePathname();

  const filteredItems = menuItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const href = item.url === '' ? `/${username}` : `/${username}${item.url}`;
        const isActive = item.url === '' 
          ? pathname === `/${username}` 
          : pathname.startsWith(href);

        return (
          <SidebarMenuItem key={item.title}>
            <Link href={href} className="w-full">
              <SidebarMenuButton
                tooltip={item.title}
                className={isActive ? 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]' : ''}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}