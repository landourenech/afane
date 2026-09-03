'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  Lock,
  BadgeCheck,
  Clock,
} from 'lucide-react';

export default function SecuritySettingsPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/${username}/settings`}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <p className="text-xl font-bold text-gray-900">Sécurité</p>
            <p className="text-sm text-gray-500 mt-1">État de votre compte</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Statut de vérification */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BadgeCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Vérification du compte</p>
                <p className="text-sm text-gray-500">
                  {profile?.verification_status === 'verified' 
                    ? '✅ Votre compte est vérifié' 
                    : '⏳ Vérification en attente'}
                </p>
              </div>
            </div>
          </div>

          {/* Méthode de connexion */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Méthode de connexion</p>
                <p className="text-sm text-gray-500">
                  Connecté via Google (compte Google gère votre mot de passe)
                </p>
              </div>
            </div>
          </div>

          {/* Date d'inscription */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Membre depuis</p>
                <p className="text-sm text-gray-500">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : 'Inconnu'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}