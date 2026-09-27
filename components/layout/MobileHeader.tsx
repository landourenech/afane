"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search } from "lucide-react";

interface MobileHeaderProps {
  username: string;
}

export function MobileHeader({ username }: MobileHeaderProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link
          href={`/${username}`}
          className="flex items-center gap-2"
          aria-label="Accueil AFANE"
        >
          <Image
            src="/logo.png"
            width={32}
            height={28}
            alt="AFANE"
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push(`/${username}/explore`)}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          <button
            onClick={() => router.push(`/${username}/notifications`)}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            {/* Badge non-lu (à connecter plus tard) */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full hidden" />
          </button>

          <Link
            href={`/${username}/profile`}
            aria-label="Mon profil"
            className="ml-1"
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={profile?.display_name || "User"}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {(profile?.display_name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
