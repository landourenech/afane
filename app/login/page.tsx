'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Mail, 
  Lock, 
  User as UserIcon,
  Send,
  Clock,
  LogOut,
  ArrowLeft,
  Sprout,
} from 'lucide-react';

export default function LoginPage() {
  const { 
    user, 
    profile, 
    loading, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    resetPassword,
    resendVerificationEmail,
    logout,
  } = useAuth();
  
  const router = useRouter();
  
  // États
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown pour le renvoi d'email
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Redirection
  useEffect(() => {
    if (!loading && user) {
      if (!user.emailVerified) {
        setNeedsVerification(true);
        return;
      }
      
      if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        const destination = profile.role === 'admin' ? '/admin' : `/${profile.username || profile.id}`;
        router.push(destination);
      }
    }
  }, [user, profile, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Votre navigateur a bloqué la fenêtre de connexion.');
      } else {
        setError('Erreur lors de la connexion Google.');
      }
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!isLogin) {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Le nom et le prénom sont requis.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, firstName, lastName);
        setNeedsVerification(true);
        setSuccess('Compte créé ! Vérifiez votre email.');
      }
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Aucun compte trouvé avec cet email.');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect.');
          break;
        case 'auth/email-already-in-use':
          setError('Cet email est déjà utilisé.');
          break;
        case 'auth/invalid-email':
          setError('Adresse email invalide.');
          break;
        case 'auth/weak-password':
          setError('Le mot de passe doit contenir au moins 6 caractères.');
          break;
        default:
          setError('Erreur d\'authentification.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Veuillez entrer votre email.');
      return;
    }
    try {
      await resetPassword(email);
      setSuccess('Email de réinitialisation envoyé !');
      setShowResetPassword(false);
    } catch {
      setError('Erreur lors de l\'envoi de l\'email.');
    }
  };

  const handleResendVerification = async () => {
    try {
      setError('');
      setSuccess('');
      await resendVerificationEmail();
      setSuccess('Email de vérification renvoyé !');
      setResendCooldown(60);
    } catch (err: any) {
      if (err.message?.includes('Trop de demandes')) {
        setError('Trop de demandes. Attendez quelques minutes.');
        setResendCooldown(120);
      } else {
        setError('Erreur lors de l\'envoi.');
      }
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vérifiez votre email
            </h2>
            <p className="text-gray-600 mb-2">
              Un email de vérification a été envoyé à :
            </p>
            <p className="font-medium text-gray-900 mb-4">{user.email}</p>
            <p className="text-sm text-gray-500 mb-6">
              Cliquez sur le lien dans l'email pour activer votre compte.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start text-left">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start text-left">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <button
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
              className="w-full flex items-center justify-center px-4 py-2 bg-[#E86C00] text-white rounded-md hover:opacity-90 disabled:opacity-50 mb-3"
            >
              {resendCooldown > 0 ? (
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Renvoyer dans {resendCooldown}s
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Renvoyer l'email
                </span>
              )}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mb-3"
            >
              J'ai vérifié mon email
            </button>

            <button
              onClick={async () => { await logout(); setNeedsVerification(false); }}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Utiliser un autre compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page de connexion principale
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C4428] via-[#0C4428] to-[#E86C00] py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo AFANE */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="AFANE"
              width={120}
              height={75}
              priority
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {isLogin ? 'Connexion à AFANE' : 'Créer un compte AFANE'}
          </h2>
          <p className="mt-1 text-white/70 text-sm">
            {isLogin ? 'Accédez à votre espace agricole' : 'Rejoignez la plateforme agricole'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Bouton Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E86C00] mr-2"></span>
                Connexion...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </>
            )}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400">ou</span>
            </div>
          </div>

          {/* Formulaire */}
          {showResetPassword ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Réinitialiser le mot de passe</h3>
                <p className="text-sm text-gray-500 mt-1">Entrez votre email pour recevoir un lien</p>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                />
              </div>
              <button
                onClick={handleResetPassword}
                className="w-full py-2.5 bg-[#E86C00] text-white rounded-lg hover:opacity-90 font-medium"
              >
                Envoyer le lien
              </button>
              <button
                onClick={() => setShowResetPassword(false)}
                className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {/* Nom et prénom */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Prénom"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                    />
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nom"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirmer mot de passe */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86C00]"
                    required
                    minLength={6}
                  />
                </div>
              )}

              {/* Bouton */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#E86C00] text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold transition-opacity"
              >
                {isSubmitting ? 'Traitement...' : isLogin ? 'Se connecter' : 'Créer le compte'}
              </button>

              {/* Liens */}
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#E86C00] hover:underline font-medium"
                >
                  {isLogin ? 'Créer un compte' : 'Déjà un compte ?'}
                </button>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 text-white rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-500/20 border border-green-500/30 text-white rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Lien retour accueil */}
        <div className="text-center">
          <Link href="/" className="text-white/60 hover:text-white text-sm flex items-center justify-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}