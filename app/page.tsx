'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && profile?.onboarding_completed) {
        router.push(profile.role === 'admin' ? '/admin' : '/dashboard');
      } else if (user && !profile?.onboarding_completed) {
        router.push('/onboarding');
      }
    }
  }, [user, profile, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Kimba Connect</h1>
        <p className="text-gray-600 mb-8">La plateforme agricole du Gabon</p>
        <a
          href="/login"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Se connecter
        </a>
      </div>
    </div>
  );
}