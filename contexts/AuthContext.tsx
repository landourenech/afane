'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';

// ============ INTERFACE ============
interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isEmailVerified: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isEmailVerified: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  resendVerificationEmail: async () => {},
  logout: async () => {},
  completeOnboarding: async () => {},
  refreshProfile: async () => {},
});

// ============ HELPERS COOKIES ============
const COOKIE_NAMES = {
  SYNC_UID: 'kc_sync_uid',
  SYNC_TIME: 'kc_sync_time',
  PROFILE_ID: 'kc_profile_id',
  USER_ROLE: 'kc_user_role',
  ONBOARDING_DONE: 'kc_onboarding_done',
  USERNAME: 'kc_username',
};

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const clearAllCookies = () => {
  Object.values(COOKIE_NAMES).forEach(deleteCookie);
};

const hasCookieConsent = (): boolean => {
  if (typeof window === 'undefined') return true;
  const consent = localStorage.getItem('cookie_consent');
  if (!consent) return false;
  
  try {
    const prefs = JSON.parse(consent);
    return prefs.necessary === true;
  } catch {
    return false;
  }
};

// ============ PROVIDER ============
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const syncInProgress = useRef(false);
  const supabase = createClient();

  // Gérer le résultat de la redirection Google
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('✅ Connexion Google via redirect réussie');
        }
      })
      .catch((error) => {
        console.error('❌ Erreur redirect Google:', error);
      });
  }, []);

  // Synchronisation SANS cookies
  const syncWithoutCookies = useCallback(async (firebaseUser: FirebaseUser) => {
    console.log('🔄 Sync sans cookies pour:', firebaseUser.email);
    
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (error) {
      console.error('Erreur sync sans cookies:', error);
    }
  }, []);

  // Synchronisation AVEC cookies
  const syncUser = useCallback(async (firebaseUser: FirebaseUser) => {
    if (syncInProgress.current) {
      console.log('🔄 Sync déjà en cours, ignoré');
      return;
    }

    if (!hasCookieConsent()) {
      console.log('⚠️ Consentement cookies non donné');
      await syncWithoutCookies(firebaseUser);
      return;
    }

    const cachedUid = getCookie(COOKIE_NAMES.SYNC_UID);
    const cachedTime = getCookie(COOKIE_NAMES.SYNC_TIME);
    
    if (cachedUid === firebaseUser.uid && cachedTime) {
      const lastSync = parseInt(cachedTime);
      const now = Date.now();
      const FIVE_MINUTES = 5 * 60 * 1000;
      
      if (now - lastSync < FIVE_MINUTES) {
        console.log('✅ Sync récente, utilisation du cache');
        
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('firebase_uid', firebaseUser.uid)
            .maybeSingle();

          if (profileData) {
            setProfile(profileData as UserProfile);
          }
        } catch (error) {
          console.error('Erreur chargement profil:', error);
        }
        
        return;
      }
    }

    syncInProgress.current = true;
    console.log('🔄 Début sync pour:', firebaseUser.email);

    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          console.log('✅ Profil synchronisé:', data.profile.id);
          setProfile(data.profile);

          setCookie(COOKIE_NAMES.SYNC_UID, firebaseUser.uid);
          setCookie(COOKIE_NAMES.SYNC_TIME, Date.now().toString());
          setCookie(COOKIE_NAMES.PROFILE_ID, data.profile.id);
          setCookie(COOKIE_NAMES.USER_ROLE, data.profile.role || 'user');
          setCookie(COOKIE_NAMES.ONBOARDING_DONE, (data.profile.onboarding_completed || false).toString());
          
          // Sauvegarder le username
          if (data.profile.username) {
            setCookie(COOKIE_NAMES.USERNAME, data.profile.username);
          }
        }
      } else {
        console.error('❌ API sync échouée:', response.status);
      }

      try {
        await supabase.auth.signInWithPassword({
          email: firebaseUser.email!,
          password: firebaseUser.uid,
        });
        console.log('✅ Session Supabase créée');
      } catch (sessionError: any) {
        console.log('⚠️ Session (non bloquant):', sessionError.message);
      }

    } catch (error) {
      console.error('❌ Erreur sync:', error);
    } finally {
      syncInProgress.current = false;
    }
  }, [supabase, syncWithoutCookies]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 État auth:', firebaseUser?.email || 'Déconnecté');
      setUser(firebaseUser);
      setIsEmailVerified(firebaseUser?.emailVerified || false);
      
      if (firebaseUser) {
        await syncUser(firebaseUser);
      } else {
        setProfile(null);
        clearAllCookies();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncUser]);

  // ============ MÉTHODES D'AUTHENTIFICATION ============
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        console.log('⚠️ Popup bloqué, utilisation de redirect');
        await signInWithRedirect(auth, provider);
      } else {
        console.error('❌ Erreur connexion Google:', error);
        throw error;
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion email réussie');
    } catch (error) {
      console.error('❌ Erreur connexion email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      console.log('✅ Inscription réussie, email de vérification envoyé');
      setIsEmailVerified(false);
    } catch (error) {
      console.error('❌ Erreur inscription email:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Email de réinitialisation envoyé');
    } catch (error) {
      console.error('❌ Erreur réinitialisation:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        console.log('✅ Email de vérification renvoyé');
      } catch (error: any) {
        console.error('❌ Erreur envoi vérification:', error);
        
        if (error.code === 'auth/too-many-requests') {
          throw new Error('Trop de demandes. Veuillez attendre quelques minutes avant de réessayer.');
        }
        
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await signOut(auth);
      
      clearAllCookies();
      
      setProfile(null);
      setUser(null);
      setIsEmailVerified(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      window.location.href = '/login';
    }
  };

  const completeOnboarding = async (data: any) => {
    if (!profile) throw new Error('No user logged in');

    try {
      const response = await fetch('/api/profile/complete-onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete onboarding');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      
      if (hasCookieConsent()) {
        setCookie(COOKIE_NAMES.ONBOARDING_DONE, 'true');
        setCookie(COOKIE_NAMES.USER_ROLE, updatedProfile.role);
        
        if (updatedProfile.username) {
          setCookie(COOKIE_NAMES.USERNAME, updatedProfile.username);
        }
      }
      
      // ✅ Rediriger vers /{username} au lieu de /dashboard
      const username = updatedProfile.username || updatedProfile.id;
      window.location.href = `/${username}`;
    } catch (error) {
      console.error('❌ Erreur onboarding:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUser(user);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading,
      isEmailVerified,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      resendVerificationEmail,
      logout,
      completeOnboarding,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);