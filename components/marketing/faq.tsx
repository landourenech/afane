'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Comment créer un compte ?', a: 'Cliquez sur "Rejoindre" et connectez-vous avec Google.' },
  { q: 'Est-ce gratuit ?', a: "Oui, l'inscription et la publication sont gratuites." },
  { q: 'Comment vendre ?', a: 'Complétez votre profil et publiez vos annonces.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <div className="px-4 pb-4 text-gray-600">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
