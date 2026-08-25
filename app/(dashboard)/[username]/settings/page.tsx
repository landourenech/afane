'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  User,
  Bell,
  Shield,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;

  const settingsItems = [
    {
      title: 'Modifier le profil',
      description: 'Nom, téléphone, localisation, bio',
      icon: User,
      href: `/${username}/settings/profile`,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Notifications',
      description: 'Email, push, SMS',
      icon: Bell,
      href: `/${username}/settings/notifications`,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Sécurité',
      description: 'Mot de passe, vérification',
      icon: Shield,
      href: `/${username}/settings/security`,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Zone dangereuse',
      description: 'Supprimer le compte',
      icon: Trash2,
      href: `/${username}/settings/danger`,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div>
      {/* Contenu desktop - grille */}
      <div className="hidden md:block p-6">
   
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
          {settingsItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* Contenu mobile - liste */}
      <div className="md:hidden">
        {/* Carte profil */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={profile?.display_name || 'Avatar'}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-gray-500" />
              </div>
            )}
            <div className="ml-4">
              <p className="font-semibold text-gray-900">{profile?.display_name}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Liste des items */}
        <div className="divide-y divide-gray-200">
          {settingsItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between bg-white p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}