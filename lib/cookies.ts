// ═══════════════════════════════════════════════════════════
// AFANE 2.0 — Gestion centralisée des cookies
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Cookies essentiels (toujours autorisés) */
export const ESSENTIAL_COOKIES = {
  SYNC_UID: 'kc_sync_uid',
  SYNC_TIME: 'kc_sync_time',
  SESSION: 'kc_session',
} as const;

/** Cookies fonctionnels (nécessitent consentement) */
export const FUNCTIONAL_COOKIES = {
  PROFILE_ID: 'kc_profile_id',
  USER_ROLE: 'kc_user_role',
  ONBOARDING_DONE: 'kc_onboarding_done',
  USERNAME: 'kc_username',
  AVATAR_URL: 'kc_avatar_url',
  DISPLAY_NAME: 'kc_display_name',
  THEME: 'kc_theme',
} as const;

export const ALL_COOKIES = {
  ...ESSENTIAL_COOKIES,
  ...FUNCTIONAL_COOKIES,
} as const;

/** Durées en jours */
export const COOKIE_DURATIONS = {
  SESSION: 30,
  SYNC: 7,
  PROFILE: 7,
  PREFERENCES: 365,
} as const;

// ─────────────────────────────────────
// TYPES
// ─────────────────────────────────────

interface SetCookieOptions {
  days?: number;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
  path?: string;
}

// ─────────────────────────────────────
// HELPERS
// ─────────────────────────────────────

export function setCookie(
  name: string,
  value: string,
  options: SetCookieOptions = {}
): void {
  if (typeof document === 'undefined') return;

  const {
    days = COOKIE_DURATIONS.SYNC,
    sameSite = 'Lax',
    secure = IS_PRODUCTION,
    path = '/',
  } = options;

  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  let cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += '; Secure';

  document.cookie = cookie;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue || '');
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export function clearAllAuthCookies(): void {
  Object.values(ALL_COOKIES).forEach(deleteCookie);
}

export function clearFunctionalCookies(): void {
  Object.values(FUNCTIONAL_COOKIES).forEach(deleteCookie);
}

// ─────────────────────────────────────
// CONSENTEMENT
// ─────────────────────────────────────

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  date: string;
}

const CONSENT_STORAGE_KEY = 'afane_cookie_consent';

export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveConsent(consent: Omit<CookieConsent, 'date'>): void {
  if (typeof window === 'undefined') return;

  const fullConsent: CookieConsent = {
    ...consent,
    date: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fullConsent));

  // Si l'utilisateur refuse les cookies fonctionnels, on les supprime
  if (!consent.functional) {
    clearFunctionalCookies();
  }
}

export function hasFunctionalConsent(): boolean {
  const consent = getConsent();
  return consent?.functional === true;
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}
