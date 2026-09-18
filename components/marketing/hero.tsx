'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Image from 'next/image';

const heroActions = [
  {
    label: 'Je vends mes récoltes',
    variant: 'default' as const,
    icon: (
      <Image
        src="/icons/delivery-truck.svg"
        alt="Icône de récolte"
        width={18}
        height={18}
      />
    ),
  },
  {
    label: 'Je cherche des produits',
    variant: 'secondary' as const,
    icon: <Search className="h-4 w-4" />,
  },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[url('/hero.png')] bg-cover bg-center bg-no-repeat md:min-h-[460px]">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Contenu */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col items-center justify-center text-center">

          {/* Petit texte */}
          <p className="mb-3 font-sans text-[10px] font-normal text-white sm:text-xs">
            Plateforme Agricole Du Gabon
          </p>

          {/* Titre */}
          <h1
            className="
              !m-0
              !max-w-4xl
              !text-4xl
              !font-semibold
              !leading-[1.1]
              !tracking-tight
              !normal-case
              !text-white
              sm:!text-5xl
              md:!text-6xl
            "
          >
            Le Marché Agricole,
            <br />
            <span className="text-[#E86C00]">
              À Portée De Main
            </span>
            .
          </h1>

          {/* Boutons */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            
            {/* Je vends */}
            <Button
              variant="default"
              className="
                h-10
                min-w-[175px]
                rounded-none
                border-0
                bg-[#E86C00]
                px-5
                font-sans
                text-xs
                font-medium
                text-white
                hover:bg-[#E86C00]/90
              "
            >
              <span>Je vends mes récoltes</span>

              <span className="ml-2 flex items-center">
                {heroActions[0].icon}
              </span>
            </Button>

            {/* Je cherche */}
            <Button
              variant="secondary"
              className="
                h-10
                min-w-[175px]
                rounded-none
                border
                border-[#E86C00]
                bg-black/20
                px-5
                font-sans
                text-xs
                font-medium
                text-white
                hover:bg-[#E86C00]/20
              "
            >
              <span>Je cherche des produits</span>

              <span className="ml-2 flex items-center">
                {heroActions[1].icon}
              </span>
            </Button>

          </div>
        </div>
      </div>
    </section>
  );
}