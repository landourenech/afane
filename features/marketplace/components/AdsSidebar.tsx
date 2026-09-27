'use client';

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

export function AdsSidebar() {
  return (
    <aside className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
        À découvrir
      </h3>

      {ADS.map((ad) => {
        const style = VARIANT_STYLES[ad.variant];
        return (
          <Link
            key={ad.id}
            href={ad.href}
            className={`block ${style.bg} ${style.text} rounded-2xl p-4 group transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
          >
            {/* Tag */}
            <span
              className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.tag} mb-2`}
            >
              {ad.tag}
            </span>

            {/* Titre */}
            <h4 className="font-bold text-sm leading-tight mb-1">
              {ad.title}
            </h4>

            {/* Subtitle */}
            <p className="text-xs opacity-80 leading-snug mb-3">
              {ad.subtitle}
            </p>

            {/* CTA */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${style.button}`}
            >
              {ad.cta}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
