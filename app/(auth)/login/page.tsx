'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
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
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Connexion à AFANE"
      subtitle="Accédez à votre espace agricole"
    >
      <GoogleButton onClick={loginWithGoogle} loading={loading} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-400 font-medium">ou</span>
        </div>
      </div>

      <LoginForm
        onSubmit={(email, password) => login({ email, password })}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}
