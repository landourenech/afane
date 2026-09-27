'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ADS = [
  {
    id: 'training',
    tag: 'Formations',
    title: 'Formations agricoles',
    subtitle: 'Apprenez les meilleures pratiques avec nos experts',
    cta: 'Voir les formations',
    href: '/formations',
    variant: 'green' as const,
  },
  {
    id: 'service',
    tag: 'Services',
    title: 'Services à la demande',
    subtitle: 'Labour, transport, conseil agricole...',
    cta: 'Demander un service',
    href: '/services',
    variant: 'orange' as const,
  },
  {
    id: 'partner',
    tag: 'Partenariat',
    title: 'Vous êtes professionnel ?',
    subtitle: 'Devenez partenaire AFANE et développez votre activité',
    cta: 'Devenir partenaire',
    href: '/partner',
    variant: 'yellow' as const,
  },
  {
    id: 'finance',
    tag: 'Financement',
    title: 'Micro-crédits agricoles',
    subtitle: 'Financez votre activité avec nos partenaires',
    cta: 'En savoir plus',
    href: '/financement',
    variant: 'green' as const,
  },
];

const VARIANT_STYLES = {
  green: {
    bg: 'bg-[var(--afane-green)]',
    text: 'text-white',
    tag: 'bg-white/15 text-white',
    button: 'bg-white text-[var(--afane-green)] hover:bg-[var(--afane-orange)] hover:text-white',
  },
  orange: {
    bg: 'bg-[var(--afane-orange)]',
    text: 'text-white',
    tag: 'bg-white/15 text-white',
    button: 'bg-white text-[var(--afane-orange)] hover:bg-[var(--afane-green)] hover:text-white',
  },
  yellow: {
    bg: 'bg-[var(--afane-yellow)]',
    text: 'text-[var(--afane-green)]',
    tag: 'bg-[var(--afane-green)]/10 text-[var(--afane-green)]',
    button: 'bg-[var(--afane-green)] text-white hover:bg-[var(--afane-orange)]',
  },
};

const ROTATION_INTERVAL = 5000;

export function AdsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADS.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused]);

  const ad = ADS[currentIndex];
  const style = VARIANT_STYLES[ad.variant];

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
          À découvrir
        </h3>
        <div className="flex items-center gap-1">
          {ADS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-4 bg-[var(--afane-orange)]'
                  : 'w-1 bg-[var(--border-secondary)] hover:bg-[var(--afane-orange)]/50'
              }`}
              aria-label={`Pub ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <Link
          key={ad.id}
          href={ad.href}
          className={`block ${style.bg} ${style.text} rounded-2xl p-5 transition-all duration-500 group`}
        >
          <span
            className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.tag} mb-3`}
          >
            {ad.tag}
          </span>

          <h4 className="font-bold text-base leading-tight mb-2">
            {ad.title}
          </h4>

          <p className="text-xs opacity-80 leading-snug mb-4">
            {ad.subtitle}
          </p>

          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${style.button}`}
          >
            {ad.cta}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="h-0.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          key={`${currentIndex}-${isPaused}`}
          className="h-full bg-[var(--afane-orange)] rounded-full"
          style={{
            animation: isPaused
              ? 'none'
              : `progress ${ROTATION_INTERVAL}ms linear forwards`,
            width: isPaused ? '0%' : undefined,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
