"use client";

import { useState } from "react";
import { ChevronDownIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

// Structure des données FAQ
const faqsData = [
  {
    question: "Comment fonctionnent les ventes collectives sur la plateforme ?",
    answer:
      "Les ventes collectives vous permettent de regrouper vos récoltes avec d'autres producteurs locaux. Cela permet d'atteindre le volume minimum requis par les grands acheteurs et de négocier de meilleurs prix.",
  },
  {
    question: "Comment sont certifiées les semences proposées ?",
    answer:
      "Toutes les semences disponibles dans notre catalogue proviennent de fournisseurs certifiés et sont testées pour garantir un taux de germination optimal adapté à votre région.",
  },
  {
    question: "Quel est le délai de livraison pour les achats groupés ?",
    answer:
      "Le délai dépend de la validation du groupe d'achat, mais en général, les commandes sont livrées sous 3 à 5 jours ouvrés après la clôture de la session d'achat.",
  },
  {
    question: "Comment entrer en contact avec un conseiller agricole ?",
    answer:
      "Vous pouvez poser vos questions directement depuis votre espace membre ou prendre un rendez-vous téléphonique avec un expert dédié à votre filière.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[var(--color-quaternary)] text-[var(--color-primary)]">
      <div className="container mx-auto px-4">
        {/* Grille responsive 1fr en mobile, 1fr/2fr en écran moyen+ */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          
          {/* Première partie : Présentation (Gauche) */}
          <div className="flex flex-col items-start gap-4 md:sticky md:top-8">
            <span className="text-sm font-semibold tracking-wider text-[var(--color-primary)]   px-3 py-1 ">
              FAQ&apos;s
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Foire aux questions
            </h2>
            <p className="opacity-90 leading-relaxed">
              Retrouvez ici les réponses aux interrogations les plus fréquentes concernant nos services, nos tarifs et le fonctionnement de notre plateforme collaborative.
            </p>
            <Button 
            
            // className=" default mt-2 inline-flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md"
            >
              Lire d&apos;avantage
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Deuxième partie : Liste des Accordéons (Droite) */}
          <div className="w-full flex flex-col gap-4">
            {faqsData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="hover:"
                >
                  {/* Bouton Accordéon */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold transition-colors gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg">{faq.question}</span>
                    <div
                      className={`p-1   transition-transform duration-300 shrink-0 ${
                        isOpen
                          ? "rotate-180  text-[var(--color-tertairy)]"
                          : ""
                      }`}
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Zone de réponse (Correction du contraste couleur) */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t leading-relaxed text-base">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}