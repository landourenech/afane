'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (error) {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Appliquer les préférences
    applyCookiePreferences(prefs);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Cookies nécessaires - toujours actifs
    // kc_sync_uid, kc_sync_time, kc_profile_id, kc_user_role, kc_onboarding_done
    // Ces cookies sont nécessaires pour l'authentification
    
    if (!prefs.analytics) {
      // Désactiver les cookies analytics (Google Analytics, etc.)
      // Supprimer les cookies analytics existants
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.trim().split("=");
        if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    saveConsent(allAccepted);
  };

  const acceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    saveConsent(essentialOnly);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Bannière principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Cookie className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  🍪 Nous utilisons des cookies
                </h3>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Nous utilisons des cookies pour améliorer votre expérience sur Kimba Connect. 
                  Certains cookies sont nécessaires au fonctionnement de la plateforme, 
                  d'autres nous aident à optimiser nos services.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-sm text-green-600 hover:text-green-700 mt-2 flex items-center"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Personnaliser les préférences
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={acceptEssential}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cookies essentiels uniquement
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de personnalisation */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-quaternary)]/10 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="">
                Préférences des cookies
              </p>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Cookies nécessaires */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <h3 className="font-medium text-[var(--color-secondary)]"> 
                    Cookies nécessaires
                  </h3>
                  <p className="text-sm text-gray-600">
                    Requis pour le fonctionnement de base (authentification, session)
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="h-4 w-4 text-green-600 rounded border-gray-300"
                  />
                  <span className="ml-2 text-xs text-gray-500">Obligatoire</span>
                </div>
              </div>

              {/* Cookies fonctionnels */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Cookies fonctionnels
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mémorisent vos préférences (langue, région, etc.)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Cookies analytics */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Cookies analytiques
                  </h3>
                  <p className="text-sm text-gray-600">
                    Nous aident à comprendre comment vous utilisez la plateforme
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => saveConsent(preferences)}
                className="px-4 py-2 bg-[var(--color-quaternary)] text-white rounded-md hover:bg-green-700"
              >
                Enregistrer les préférences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}