'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap, Truck, Handshake } from 'lucide-react';
import { AD_BANNERS } from '../data/categories';

const COLOR_STYLES = {
  orange: {
    bg: 'bg-gradient-to-br from-[#e86c00] to-[#d16000]',
    text: 'text-white',
  },
  green: {
    bg: 'bg-gradient-to-br from-[#0c4428] to-[#0a3822]',
    text: 'text-white',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-[#fdc400] to-[#e8b000]',
    text: 'text-[#0c4428]',
  },
};

const ICONS = {
  training: GraduationCap,
  service: Truck,
  partnership: Handshake,
};

export function AdsSection() {
  return (
    <div className="space-y-3">
      {AD_BANNERS.map((ad) => {
        const style = COLOR_STYLES[ad.color];
        const Icon = ICONS[ad.type];

        return (
          <Link
            key={ad.id}
            href={ad.href}
            className={`block ${style.bg} ${style.text} rounded-2xl p-4 hover:shadow-lg transition-shadow group`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{ad.title}</p>
                <p className="text-xs opacity-90 mt-0.5">{ad.subtitle}</p>
              </div>
              <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
            <button className="mt-3 w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold hover:bg-white/30 transition-colors">
              {ad.cta}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
