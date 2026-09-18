'use client';

import { Sprout, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Sprout, title: 'Produits frais', desc: 'Des produits agricoles de qualité' },
    { icon: Users, title: 'Communauté', desc: 'Connectez-vous avec des producteurs' },
    { icon: ShoppingCart, title: 'Achat facile', desc: 'Commandez en quelques clics' },
    { icon: TrendingUp, title: 'Prix justes', desc: 'Les meilleurs prix du marché' },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi AFANE ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-14 h-14 bg-[#E86C00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-[#E86C00]" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
