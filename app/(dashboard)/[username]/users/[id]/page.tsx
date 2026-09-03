'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BadgeCheck,
  Shield,
  User as UserIcon,
  Package,
  ShoppingCart,
  TrendingUp,
  Activity,
} from 'lucide-react';

export default function UserDetailPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const userId = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [userDetail, setUserDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userPublications, setUserPublications] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Charger les détails de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        setUserDetail(userData);

        // Charger les publications de l'utilisateur
        const { data: pubsData, error: pubsError } = await supabase
          .from('publications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (pubsError) throw pubsError;
        setUserPublications(pubsData || []);
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Utilisateur non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/${username}/users`}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Profil utilisateur</h1>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* COVER */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[var(--color-quaternary)] to-[var(--color-secondary)]" />
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                {userDetail.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userDetail.avatar_url}
                    alt={userDetail.display_name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center shadow-lg">
                    <UserIcon className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {userDetail.display_name || 'Utilisateur'}
                    {userDetail.verification_status === 'verified' && (
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </h2>
                  <p className="text-gray-500">@{userDetail.username}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  userDetail.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  userDetail.role === 'producer' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {userDetail.role}
                </span>
              </div>
            </div>
          </div>

          {/* INFOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg shadow p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Informations</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userDetail.email}
                </p>
                {userDetail.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {userDetail.phone}
                  </p>
                )}
                {userDetail.city && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {userDetail.city}{userDetail.region ? `, ${userDetail.region}` : ''}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Inscrit le {new Date(userDetail.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Publications</h3>
              <p className="text-3xl font-bold text-[var(--color-secondary)]">
                {userPublications.length}
              </p>
              <p className="text-sm text-gray-500">publications actives</p>
            </div>
          </div>

          {/* PUBLICATIONS RÉCENTES */}
          {userPublications.length > 0 && (
            <div className="bg-white rounded-lg shadow mt-4">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Publications récentes</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {userPublications.map((pub) => (
                  <div key={pub.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{pub.title}</p>
                      <p className="text-sm text-gray-500">
                        {pub.price.toLocaleString('fr-FR')} FCFA - {pub.main_category}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {pub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}