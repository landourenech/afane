'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00]"></div>
      </div>
    );
  }

  // Écran de vérification d'email
  if (needsVerification && user && !user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
            <p className="text-gray-600 mb-2">Un email de vérification a été envoyé à :</p>
            <p className="font-medium text-gray-900 mb-4">{user.email}</p>
            <p className="text-sm text-gray-500 mb-6">
              Cliquez sur le lien dans l'email pour activer votre compte.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full bg-[#E86C00] hover:bg-[#E86C00]/90">
              <Send className="h-4 w-4 mr-2" />
              J'ai vérifié mon email
            </Button>
          </div>
        </div>
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
          <h2 className="mt-4 text-2xl font-bold text-white">Créer un compte AFANE</h2>
          <p className="mt-1 text-white/70 text-sm">Rejoignez la plateforme agricole</p>
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
          <SignupForm onSubmit={handleSignup} loading={loading} error={error} />
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
