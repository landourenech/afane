'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function SignupForm({ onSubmit, loading, error }: SignupFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Indicateurs de force du mot de passe
  const passwordChecks = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    await onSubmit({ firstName, lastName, email, password });
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nom et prénom */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Prénom
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              required
              disabled={loading}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#E86C00] focus:ring-2 focus:ring-[#E86C00]/20 transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Nom
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              required
              disabled={loading}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#E86C00] focus:ring-2 focus:ring-[#E86C00]/20 transition-all"
            />
          </div>
        </div>
      </div>

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
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
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

        {/* Indicateur de force */}
        {password && (
          <div className="space-y-2 pt-1">
            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    passwordStrength >= level
                      ? passwordStrength === 3
                        ? 'bg-green-500'
                        : passwordStrength === 2
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <ul className="space-y-1 text-xs">
              <li className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordChecks.length ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
                Au moins 6 caractères
              </li>
              <li className={`flex items-center gap-1.5 ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordChecks.hasNumber ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
                Au moins 1 chiffre
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirmer le mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            disabled={loading}
            className={`pl-10 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#E86C00]/20 transition-all ${
              confirmPassword && confirmPassword !== password
                ? 'border-red-300 focus:border-red-500'
                : 'focus:border-[#E86C00]'
            }`}
          />
          {confirmPassword && confirmPassword === password && (
            <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
      </div>

      {/* Error */}
      {displayError && (
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{displayError}</span>
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
            Création...
          </span>
        ) : (
          'Créer mon compte'
        )}
      </Button>

      {/* Switch to login */}
      <p className="text-center text-sm text-gray-600 pt-2">
        Déjà un compte ?{' '}
        <Link
          href="/login"
          className="text-[#E86C00] font-semibold hover:underline transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
