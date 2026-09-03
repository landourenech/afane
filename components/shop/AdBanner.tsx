'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Megaphone, ArrowRight, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';

interface AdBannerProps {
  variant?: 'popup' | 'banner' | 'inline';
  className?: string;
  autoShow?: boolean;
  delay?: number;
  adId?: string;  // ✅ Ajouté
}

export function AdBanner({ 
  variant = 'banner', 
  className = '',
  autoShow = false,
  delay = 3000,
  adId = 'default-ad',
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si déjà fermé dans localStorage
    const storageKey = `ad_dismissed_${adId}`;
    const dismissed = localStorage.getItem(storageKey);
    
    if (dismissed === 'true') {
      setIsVisible(false);
      return;
    }

    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [autoShow, delay, adId]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(`ad_dismissed_${adId}`, 'true');
  }, [adId]);

  if (!isVisible) return null;

  // BANNIÈRE HORIZONTALE
  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0C4428] via-[#E86C00] to-[#0C4428] p-4 md:p-6 shadow-lg ${className}`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors z-10"
          aria-label="Fermer la publicité"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex p-3 bg-white/20 rounded-full flex-shrink-0">
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
            onClick={handleClose}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-[#E86C00] rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all flex-shrink-0"
          >
            J'en profite
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // POP-UP MODAL
  if (variant === 'popup') {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
        onClick={handleClose}
      >
        <div 
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-40 bg-gradient-to-r from-[#0C4428] to-[#E86C00]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-white opacity-50" />
            </div>
          </div>

          <div className="p-6 text-center">
            <div className="inline-flex p-3 bg-[#E86C00]/10 rounded-full mb-4">
              <Tag className="h-6 w-6 text-[#E86C00]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              🎁 Offre de bienvenue
            </h3>
            <p className="text-gray-600 mt-2">
              Recevez <strong>-20%</strong> sur votre première commande !
            </p>
            <Link
              href="/signup"
              onClick={handleClose}
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-[#E86C00] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Créer un compte
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleClose}
              className="block w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              Non merci, je préfère parcourir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PUBLICITÉ INLINE
  if (variant === 'inline') {
    return (
      <div className={`relative overflow-hidden rounded-xl border-2 border-dashed border-[#E86C00]/30 bg-[#E86C00]/5 p-4 ${className}`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E86C00]/10 rounded-lg flex-shrink-0">
            <Megaphone className="h-5 w-5 text-[#E86C00]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              📢 Espace publicitaire
            </p>
            <p className="text-xs text-gray-500">
              Votre publicité ici
            </p>
          </div>
          <Link
            href="/advertise"
            className="text-xs font-medium text-[#E86C00] hover:underline flex-shrink-0"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    );
  }

  return null;
}