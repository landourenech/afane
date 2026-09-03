'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export default function DangerZonePage() {
  const { profile, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;
  const supabase = createClient();

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (!profile) return;
    
    if (confirmText !== 'SUPPRIMER') {
      setError('Veuillez taper SUPPRIMER pour confirmer.');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (error) throw error;

      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erreur suppression:', error);
      setError('Erreur lors de la suppression du compte.');
      setIsDeleting(false);
    }
  };

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
            <p >Zone dangereuse</p>
            <p className="text-sm text-gray-500 mt-1">Actions irréversibles</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow border border-red-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Trash2 className="h-4 w-4 text-red-600 mr-3" />
                <p >Supprimer le compte</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées définitivement :
              </p>
              
              <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
                <li>Votre profil</li>
                <li>Vos produits</li>
                <li>Vos commandes</li>
                <li>Vos messages</li>
                <li>Vos préférences</li>
              </ul>

              <div className="p-3 bg-red-50 rounded-md mb-4">
                <p className="text-sm text-red-700">
                  Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
                </p>
              </div>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              />

              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== 'SUPPRIMER'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}