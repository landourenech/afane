'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MessageCircle, Loader2 } from 'lucide-react';
import { getOrCreateConversation } from '../services/message.service';
import { useAuth } from '@/contexts/AuthContext';

interface ContactSellerButtonProps {
  sellerId: string;
  sellerName?: string;
  productTitle?: string;
  variant?: 'primary' | 'outline' | 'compact';
  className?: string;
}

export function ContactSellerButton({
  sellerId,
  sellerName,
  productTitle,
  variant = 'primary',
  className = '',
}: ContactSellerButtonProps) {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!profile?.id) {
      router.push('/login');
      return;
    }

    if (profile.id === sellerId) {
      setError('C\'est votre propre produit');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const conversationId = await getOrCreateConversation(profile.id, sellerId);
      router.push(`/${username}/messages?conversation=${conversationId}`);
    } catch (err: any) {
      console.error('Erreur contact vendeur:', err);
      setError('Impossible de contacter');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`p-3 rounded-full bg-[var(--afane-green)] text-white hover:bg-[var(--afane-orange)] active:scale-95 transition-all disabled:opacity-50 ${className}`}
        aria-label="Contacter le vendeur"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
      </button>
    );
  }

  const baseClass = 'flex items-center justify-center gap-2 font-semibold rounded-full transition-all active:scale-[0.98] disabled:opacity-50';
  const variantClass = variant === 'primary'
    ? 'h-12 px-6 bg-[var(--afane-green)] text-white hover:bg-[var(--afane-orange)] text-sm'
    : 'h-12 px-6 bg-transparent border-2 border-[var(--afane-green)] text-[var(--afane-green)] hover:bg-[var(--afane-green)] hover:text-white text-sm';

  return (
    <div className={className}>
      <button onClick={handleClick} disabled={loading} className={`${baseClass} ${variantClass} w-full`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
        {loading ? 'Ouverture...' : 'Discuter avec le vendeur'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1 text-center">{error}</p>}
    </div>
  );
}
