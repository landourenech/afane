'use client';

import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Favoris</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Heart className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500">Aucun favori pour le moment</p>
      </div>
    </div>
  );
}
