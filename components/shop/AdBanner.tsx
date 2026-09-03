'use client';

import { useState, useEffect } from 'react';
import { X, Megaphone, ArrowRight, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';

interface AdBannerProps {
  variant?: 'popup' | 'banner' | 'inline';
  className?: string;
  autoShow?: boolean;
  delay?: number;
}

export function AdBanner({ 
  variant = 'banner', 
  className = '',
  autoShow = false,
  delay = 3000,
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(!autoShow);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (autoShow && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [autoShow, delay, isDismissed]);

  // ✅ Fonction de fermeture qui met à jour l'état local
  const handleClose = () => {
    console.log('Fermeture de la publicité');
    setIsVisible(false);
    setIsDismissed(true);
  };

  // Si fermé, ne rien afficher
  if (!isVisible || isDismissed) return null;

  // BANNIÈRE
  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[var(--color-quaternary)] via-[var(--color-secondary)] to-[var(--color-quaternary)] p-4 md:p-6 shadow-lg ${className}`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors z-10"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex p-3 bg-white/20 rounded-full">
            <Megaphone className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Offre spéciale
            </p>
            <h3 className="text-lg md:text-xl font-bold mt-0.5">
              🎉 Promo de lancement : -20% sur tous les produits !
            </h3>
            <p className="text-sm opacity-80 mt-1">
              Profitez de notre offre de bienvenue avant la fin du mois.
            </p>
          </div>
          <Link
            href="/promo"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-[var(--color-secondary)] rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all"
          >
            J'en profite
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // POP-UP
  if (variant === 'popup') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
        <div 
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image de fond */}
          <div className="relative h-40 bg-gradient-to-r from-[var(--color-quaternary)] to-[var(--color-secondary)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-white opacity-50" />
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 text-center">
            <div className="inline-flex p-3 bg-[var(--color-secondary)]/10 rounded-full mb-4">
              <Tag className="h-6 w-6 text-[var(--color-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              🎁 Offre de bienvenue
            </h3>
            <p className="text-gray-600 mt-2">
              Inscrivez-vous maintenant et recevez <strong>-20%</strong> sur votre première commande !
            </p>
            <Link
              href="/signup"
              onClick={handleClose}
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-[var(--color-secondary)] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Créer un compte gratuit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              * Offre valable jusqu'à la fin du mois
            </p>
          </div>
        </div>
      </div>
    );
  }

  // INLINE
  if (variant === 'inline') {
    return (
      <div className={`relative overflow-hidden rounded-xl border-2 border-dashed border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/5 p-4 ${className}`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-secondary)]/10 rounded-lg">
            <Megaphone className="h-5 w-5 text-[var(--color-secondary)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              📢 Espace publicitaire
            </p>
            <p className="text-xs text-gray-500">
              Votre publicité ici - Contactez-nous
            </p>
          </div>
          <Link
            href="/advertise"
            className="text-xs font-medium text-[var(--color-secondary)] hover:underline"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    );
  }

  return null;
}