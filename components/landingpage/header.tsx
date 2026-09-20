'use client';

import { Menu, X, ShoppingCart, User, Bell } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NotificationsDropdown } from './NotificationsDropdown';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleJoinClick = () => {
    if (user) {
      // Si connecté, rediriger vers son espace
      if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        router.push(`/${profile.username || profile.id}`);
      }
    } else {
      router.push('/login');
    }
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/carte', label: 'Carte agricole' },
    { href: '/conseil', label: 'Conseils' },
    { href: '/apropos', label: "Comment ça marche" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="h-20 flex items-center justify-between container mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="AFANE"
            width={130}
            height={40}
            priority
            className="object-contain"
          />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#E86C00] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
          


                {/* Bouton espace */}
                <Button
                  onClick={handleJoinClick}
                  className="px-4 py-2 bg-[#E86C00] text-white hover:opacity-90"
                >
                  Mon espace
                </Button>
              </>
            ) : (
              <Button
                onClick={handleJoinClick}
                className="px-5 py-2.5 bg-[#E86C00] text-white hover:opacity-90"
              >
                Rejoindre
              </Button>
            )}
          </div>
        </nav>

        {/* Bouton Hamburger Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <Link
              href={`/${profile?.username || profile?.id}`}
              className="flex items-center"
            >
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#E86C00]"
                />
              ) : (
                <div className="w-8 h-8 bg-[#E86C00] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {(profile?.display_name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="text-[#E86C00] hover:bg-[#E86C00]/10 rounded-full p-2 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-[#E86C00]/20 px-4 pt-4 pb-6 flex flex-col gap-4 shadow-lg">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-700 font-medium hover:text-[#E86C00] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            {user ? (
              <>
                <Button
                  onClick={() => {
                    handleJoinClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#E86C00] text-white hover:opacity-90"
                >
                  Mon espace
                </Button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm text-[var(--color-secondary)] hover:text-red-600 transition-colors"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <Button
                onClick={() => {
                  handleJoinClick();
                  setIsMenuOpen(false);
                }}
                className="w-full py-3 bg-[#E86C00] text-white hover:opacity-90"
              >
                Rejoindre
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}