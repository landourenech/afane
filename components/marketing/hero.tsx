'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-[#0C4428] to-[#E86C00] py-20 px-4">
      <div className="max-w-6xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenue sur AFANE
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          La plateforme agricole qui connecte producteurs, acheteurs et fournisseurs au Gabon.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E86C00] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Explorer la boutique
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
