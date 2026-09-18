'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre inscription !');
    setEmail('');
  };

  return (
    <section className="py-16 px-4 bg-[#0C4428] text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
        <p className="mb-8 opacity-90">Recevez nos actualités et offres spéciales</p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
          />
          <button type="submit" className="px-6 py-3 bg-[#E86C00] rounded-lg hover:opacity-90">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
