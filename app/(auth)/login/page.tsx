'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleButton } from '@/features/auth/components/GoogleButton';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuthMutations } from '@/features/auth/hooks/use-auth-mutations';

export default function LoginPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { login, loginWithGoogle, loading, error } = useAuthMutations();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !isRedirecting) {
      setIsRedirecting(true);
      if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        router.push(`/${profile.username || profile.id}`);
      }
    }
  }, [user, profile, authLoading, router, isRedirecting]);

  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C4428] via-[#0C4428] to-[#E86C00] py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="AFANE" width={120} height={40} priority className="mx-auto brightness-0 invert" />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Connexion à AFANE</h2>
          <p className="mt-1 text-white/70 text-sm">Accédez à votre espace agricole</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <GoogleButton onClick={loginWithGoogle} loading={loading} />
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400">ou</span>
            </div>
          </div>
          <LoginForm
            onSubmit={(email, password) => login({ email, password })}
            loading={loading}
            error={error}
          />
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
