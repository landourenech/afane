'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { useAuthMutations } from '@/features/auth/hooks/use-auth-mutations';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error } = useAuthMutations();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      // Erreur gérée par le hook
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Email envoyé !"
        subtitle="Vérifiez votre boîte de réception"
        showBackToHome={false}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <p className="text-gray-600">
            Un lien de réinitialisation a été envoyé à
          </p>
          <p className="font-semibold text-gray-900">{email}</p>

          <div className="p-4 bg-gray-50 rounded-xl text-left">
            <p className="text-sm text-gray-600">
              Suivez les instructions dans l'email pour définir un nouveau mot de passe.
            </p>
          </div>

          <Link href="/login" className="block">
            <Button className="w-full h-12 bg-[#E86C00] hover:bg-[#E86C00]/90 text-white rounded-xl font-semibold">
              Retour à la connexion
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Recevez un lien de réinitialisation"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#E86C00] focus:ring-2 focus:ring-[#E86C00]/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#E86C00] hover:bg-[#E86C00]/90 text-white rounded-xl font-semibold shadow-lg shadow-[#E86C00]/20"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="spinner spinner-sm border-white/30 border-t-white" />
              Envoi...
            </span>
          ) : (
            'Envoyer le lien'
          )}
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#E86C00] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </form>
    </AuthLayout>
  );
}
