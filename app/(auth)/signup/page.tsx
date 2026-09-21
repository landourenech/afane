'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        router.push(`/${profile.username || profile.id}`);
      }
    }
  }, [user, profile, authLoading, router]);

  const handleSignup = async (data: any) => {
    await signup(data);
    setNeedsVerification(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // Écran de vérification
  if (needsVerification && user && !user.emailVerified) {
    return (
      <AuthLayout
        title="Vérifiez votre email"
        subtitle="Confirmez votre adresse pour continuer"
        showBackToHome={false}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#E86C00]/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-[#E86C00]" />
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-2">
              Un email de vérification a été envoyé à :
            </p>
            <p className="font-semibold text-gray-900">{user.email}</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Cliquez sur le lien dans l'email pour activer votre compte, puis revenez ici.
              </p>
            </div>
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full h-12 bg-[#E86C00] hover:bg-[#E86C00]/90 text-white rounded-xl font-semibold"
          >
            <Send className="h-4 w-4 mr-2" />
            J'ai vérifié mon email
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Créer un compte AFANE"
      subtitle="Rejoignez la plateforme agricole"
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

      <SignupForm onSubmit={handleSignup} loading={loading} error={error} />
    </AuthLayout>
  );
}
