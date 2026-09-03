'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function TestLogoutPage() {
  const { user, profile, logout } = useAuth();
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    setMessage('Déconnexion en cours...');
    await logout();
  };

  const handleApiLogout = async () => {
    setMessage('Appel API de déconnexion...');
    window.location.href = '/api/test/logout';
  };

  const handleClearCookies = () => {
    setMessage('Nettoyage des cookies...');
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    setMessage('Cookies nettoyés. Redirection...');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Page de test - Déconnexion</h1>
        
        <div className="space-y-4 mb-6">
          <div className="p-3 bg-gray-50 rounded">
            <p><strong>Utilisateur Firebase :</strong> {user?.email || 'Non connecté'}</p>
            <p><strong>Profil Supabase :</strong> {profile?.email || 'Non trouvé'}</p>
          </div>

          {message && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded">
              {message}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Déconnexion complète
          </button>

          <button
            onClick={handleApiLogout}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Déconnexion via API
          </button>

          <button
            onClick={handleClearCookies}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Nettoyer les cookies
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded">
          <h2 className="font-semibold mb-2">Cookies actuels :</h2>
          <pre className="text-xs overflow-auto max-h-40">
            {typeof document !== 'undefined' ? document.cookie : ''}
          </pre>
        </div>
      </div>
    </div>
  );
}