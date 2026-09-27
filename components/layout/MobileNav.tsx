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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 safe-area-bottom"
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
              className={`relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
                isActive
                  ? "text-[var(--color-secondary)]"
                  : "text-gray-500 hover:text-gray-700 active:bg-gray-50"
              }`}
            >
              {/* Barre active en haut */}
              {isActive && (
                <span className="absolute top-0 h-0.5 w-10 bg-[var(--color-secondary)] rounded-b-full" />
              )}

              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
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
