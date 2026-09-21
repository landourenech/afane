'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginInput, SignupInput } from '../schemas/auth.schema';

export function useAuthMutations() {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError('');
      await signInWithEmail(data.email, data.password);
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupInput) => {
    try {
      setLoading(true);
      setError('');
      await signUpWithEmail(data.email, data.password, data.firstName, data.lastName);
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError('');
      await resetPassword(email);
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loginWithGoogle, forgotPassword, loading, error };
}

function getErrorMessage(err: any): string {
  switch (err.code) {
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez attendre.';
    case 'auth/popup-blocked':
      return 'Votre navigateur a bloqué la fenêtre.';
    default:
      return err.message || 'Erreur de connexion.';
  }
}
