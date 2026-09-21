'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { GoogleButton } from '@/features/auth/components/GoogleButton';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { useAuthMutations } from '@/features/auth/hooks/use-auth-mutations';

export default function SignupPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { signup, loginWithGoogle, loading, error } = useAuthMutations();
  const router = useRouter();
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (!user.emailVerified) {
        setNeedsVerification(true);
        return;
      }
      router.push(
        !profile?.onboarding_completed
          ? '/onboarding'
          : `/${profile.username || profile.id}`
      );
    }
  }, [user, profile, authLoading, router]);

  const handleSignup = async (data: any) => {
    await signup(data);
    setNeedsVerification(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (needsVerification && user && !user.emailVerified) {
    return (
      <AuthLayout title="Vérifiez votre email" subtitle="Un email vous a été envoyé">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-orange-50 rounded-full">
            <Mail className="h-8 w-8 text-[#e86c00]" />
          </div>
          <p className="text-sm text-gray-600">Email envoyé à</p>
          <p className="font-semibold text-gray-900">{user.email}</p>
          <p className="text-sm text-gray-500">
            Cliquez sur le lien pour activer votre compte
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full"
          >
            J'ai vérifié mon email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez AFANE">
      <GoogleButton onClick={loginWithGoogle} loading={loading} />
      <div className="divider">ou</div>
      <SignupForm onSubmit={handleSignup} loading={loading} error={error} />
    </AuthLayout>
  );
}
