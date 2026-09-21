'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
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
    } catch {}
  };

  if (sent) {
    return (
      <AuthLayout title="Email envoyé" subtitle="Vérifiez votre boîte">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-green-50 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Lien envoyé à</p>
          <p className="font-semibold text-gray-900">{email}</p>
          <Link href="/login" className="btn btn-primary w-full">
            Retour à la connexion
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Mot de passe oublié" subtitle="Recevez un lien de réinitialisation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
            disabled={loading}
            className="input"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <>
              <span className="spinner" />
              Envoi...
            </>
          ) : (
            'Envoyer le lien'
          )}
        </button>

        <p className="text-center text-sm text-gray-500 pt-2">
          <Link href="/login" className="text-[#e86c00] font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
