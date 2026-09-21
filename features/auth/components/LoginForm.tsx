'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
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

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Mot de passe
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[#E86C00] hover:text-[#E86C00]/80 hover:underline transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#E86C00] focus:ring-2 focus:ring-[#E86C00]/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-[#E86C00] hover:bg-[#E86C00]/90 text-white rounded-xl font-semibold shadow-lg shadow-[#E86C00]/20 hover:shadow-xl hover:shadow-[#E86C00]/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="spinner spinner-sm border-white/30 border-t-white" />
            Connexion...
          </span>
        ) : (
          'Se connecter'
        )}
      </Button>

      {/* Switch to signup */}
      <p className="text-center text-sm text-gray-600 pt-2">
        Pas encore de compte ?{' '}
        <Link
          href="/signup"
          className="text-[#E86C00] font-semibold hover:underline transition-colors"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
