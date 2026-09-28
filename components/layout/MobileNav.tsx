"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMobileTabs } from "@/config/mobile-tabs";

interface MobileNavProps {
  username: string;
}

export function MobileNav({ username }: MobileNavProps) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const tabs = getMobileTabs(profile?.role);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--afane-green)] border-t border-[var(--afane-orange)]/20 safe-area-bottom"
      aria-label="Navigation mobile"
    >
      <div className="flex items-stretch justify-around h-16">
        {tabs.map((tab) => {
          const href =
            tab.url === "" ? `/${username}` : `/${username}${tab.url}`;

          const isActive =
            tab.url === ""
              ? pathname === `/${username}`
              : pathname.startsWith(href);

          const Icon = tab.icon;

          return (
            <Link
              key={tab.title}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-all duration-200 !text-white ${
                isActive
                  ? ""
                  : "hover:bg-[var(--afane-orange)] hover:!text-white"
              }`}
              style={{ color: '#ffffff' }}
            >
              {/* Barre active en haut */}
              {isActive && (
                <span className="absolute top-0 h-0.5 w-10 bg-[var(--afane-orange)] rounded-b-full" />
              )}

              <Icon
                className="h-5 w-5 transition-colors !text-white"
                strokeWidth={isActive ? 2.5 : 2}
                style={{ color: '#ffffff', stroke: '#ffffff' }}
              />
              <span
                className={`text-[10px] leading-tight transition-colors !text-white ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
                style={{ color: '#ffffff' }}
              >
                {tab.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
