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
      router.push(
        !profile?.onboarding_completed
          ? '/onboarding'
          : `/${profile.username || profile.id}`
      );
    }
  }, [user, profile, authLoading, router, isRedirecting]);

  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace">
      <GoogleButton onClick={loginWithGoogle} loading={loading} />
      <div className="divider">ou</div>
      <LoginForm
        onSubmit={(email, password) => login({ email, password })}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}
