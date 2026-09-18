'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, ArrowLeft, Sprout } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C4428] via-[#0C4428] to-[#E86C00] px-4">
      <div className="max-w-2xl w-full text-center">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/logo.png"
            alt="AFANE"
            width={150}
            height={50}
            priority
            className="mx-auto"
          />
        </Link>

        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4">404</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="h-8 w-8 text-white/80" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Page non trouvée
            </h2>
          </div>
          <p className="text-white/80 text-base md:text-lg max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#E86C00] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5" />
            Retour à l'accueil
          </Link>
          <Link
            href="/boutique"
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
          >
            <Search className="h-5 w-5" />
            Explorer la boutique
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la page précédente
        </button>
      </div>
    </div>
  );
}
