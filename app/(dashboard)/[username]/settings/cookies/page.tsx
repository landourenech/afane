'use client';

import { useState, useEffect } from 'react';
import { Cookie, Check } from 'lucide-react';
import {
  getConsent,
  saveConsent,
  clearFunctionalCookies,
  type CookieConsent,
} from '@/lib/cookies';

export default function CookieSettingsPage() {
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
    date: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (existing) setConsent(existing);
  }, []);

  const handleSave = () => {
    saveConsent({
      necessary: true,
      functional: consent.functional,
      analytics: consent.analytics,
      marketing: consent.marketing,
    });

    if (!consent.functional) {
      clearFunctionalCookies();
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({
    label,
    description,
    checked,
    disabled,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-start justify-between gap-4 p-4 border border-[var(--border-primary)] rounded-xl">
      <div className="flex-1">
        <p className="font-semibold text-sm text-[var(--text-primary)]">
          {label}
          {disabled && (
            <span className="ml-2 text-[10px] text-[var(--afane-orange)] font-normal">
              (obligatoire)
            </span>
          )}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {description}
        </p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-[var(--afane-orange)]' : 'bg-[var(--text-tertiary)]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--afane-orange)]/10 rounded-lg">
          <Cookie className="h-6 w-6 text-[var(--afane-orange)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Préférences cookies
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Contrôlez les cookies utilisés par AFANE
          </p>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-6">
        <Toggle
          label="Cookies essentiels"
          description="Nécessaires au fonctionnement (authentification, session). Ne peuvent pas être désactivés."
          checked={true}
          disabled
          onChange={() => {}}
        />
        <Toggle
          label="Cookies fonctionnels"
          description="Mémorisent vos préférences (profil, rôle, thème) pour améliorer votre expérience."
          checked={consent.functional}
          onChange={(v) => setConsent({ ...consent, functional: v })}
        />
        <Toggle
          label="Cookies analytiques"
          description="Nous aident à comprendre comment vous utilisez l'application."
          checked={consent.analytics}
          onChange={(v) => setConsent({ ...consent, analytics: v })}
        />
        <Toggle
          label="Cookies marketing"
          description="Utilisés pour vous proposer des contenus personnalisés."
          checked={consent.marketing}
          onChange={(v) => setConsent({ ...consent, marketing: v })}
        />
      </div>

      {/* Info */}
      {consent.date && (
        <p className="text-xs text-[var(--text-tertiary)] mb-4 text-center">
          Dernière modification :{' '}
          {new Date(consent.date).toLocaleDateString('fr-FR')}
        </p>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-3 bg-[var(--afane-orange)] text-[var(--text-inverse)] font-semibold rounded-xl hover:bg-[var(--afane-orange-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        {saved ? (
          <>
            <Check className="h-5 w-5" />
            Préférences enregistrées
          </>
        ) : (
          'Enregistrer mes préférences'
        )}
      </button>

      <p className="text-xs text-[var(--text-tertiary)] text-center mt-4">
        Consultez notre{' '}
        <a
          href="/cookie-policy"
          className="text-[var(--afane-orange)] hover:underline"
        >
          politique de cookies
        </a>
      </p>
    </div>
  );
}
