'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { DataTable } from '@/components/dashboard/table';
import { 
  Users as UsersIcon,
  Search, 
  Filter,
  X,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  User,
  BadgeCheck,
  Shield,
} from 'lucide-react';

// Types
interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  phone?: string;
  role: 'user' | 'producer' | 'cooperative' | 'buyer' | 'supplier' | 'advisor' | 'admin';
  verification_status: 'pending' | 'verified' | 'rejected';
  onboarding_completed: boolean;
  region?: string;
  city?: string;
  avatar_url?: string;
  created_at: string;
}

interface Stats {
  total: number;
  verified: number;
  producers: number;
  admin: number;
}

export default function UsersPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    verified: 0,
    producers: 0,
    admin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users?limit=200');
      if (response.ok) {
        const data = await response.json();
        const usersList: UserProfile[] = data.users || [];
        
        setUsers(usersList);
        setFilteredUsers(usersList);
        
        setStats({
          total: usersList.length,
          verified: usersList.filter((u: UserProfile) => u.verification_status === 'verified').length,
          producers: usersList.filter((u: UserProfile) => u.role === 'producer').length,
          admin: usersList.filter((u: UserProfile) => u.role === 'admin').length,
        });
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const filtered = users.filter((user: UserProfile) => {
      const matchesSearch = 
        (user.display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.verification_status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [users, searchQuery, filterRole, filterStatus]);

  const columns = [
    { 
      key: 'display_name' as const, 
      label: 'Utilisateur',
      href: `/${username}/users/{id}`
    },
    { 
      key: 'email' as const, 
      label: 'Email' 
    },
    { 
      key: 'role' as const, 
      label: 'Rôle' 
    },
    { 
      key: 'verification_status' as const, 
      label: 'Vérification' 
    },
    { 
      key: 'city' as const, 
      label: 'Localisation' 
    },
    { 
      key: 'created_at' as const, 
      label: 'Inscrit le' 
    },
  ];

  const actions = [
    { label: 'Voir profil', icon: 'eye' as const, href: `/${username}/users/{id}` },
    { label: 'Modifier', icon: 'pencil' as const, href: `/${username}/users/{id}/edit` },
    { label: 'Supprimer', icon: 'trash' as const, variant: 'destructive' as const },
  ];

  const tableData = filteredUsers.map((user: UserProfile) => ({
    id: user.id,
    display_name: user.display_name || user.email.split('@')[0],
    email: user.email,
    role: user.role === 'producer' ? '🌾 Producteur' :
          user.role === 'cooperative' ? '🤝 Coopérative' :
          user.role === 'buyer' ? '🛒 Acheteur' :
          user.role === 'supplier' ? '🏭 Fournisseur' :
          user.role === 'advisor' ? '📋 Conseiller' :
          user.role === 'admin' ? '🛡️ Admin' : '👤 Utilisateur',
    verification_status: user.verification_status === 'verified' ? '✅ Vérifié' :
                         user.verification_status === 'pending' ? '⏳ En attente' : '❌ Rejeté',
    city: user.city || user.region || '-',
    created_at: new Date(user.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.total} utilisateur{stats.total > 1 ? 's' : ''} inscrit{stats.total > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* STATISTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <BadgeCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Vérifiés</p>
                <p className="text-xl font-bold text-gray-900">{stats.verified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <User className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Producteurs</p>
                <p className="text-xl font-bold text-gray-900">{stats.producers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Admins</p>
                <p className="text-xl font-bold text-gray-900">{stats.admin}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTRES */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un utilisateur..."
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </button>

              <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-3`}>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="user">👤 Utilisateur</option>
                  <option value="producer">🌾 Producteur</option>
                  <option value="cooperative">🤝 Coopérative</option>
                  <option value="buyer">🛒 Acheteur</option>
                  <option value="supplier">🏭 Fournisseur</option>
                  <option value="advisor">📋 Conseiller</option>
                  <option value="admin">🛡️ Admin</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="verified">✅ Vérifiés</option>
                  <option value="pending">⏳ En attente</option>
                  <option value="rejected">❌ Rejetés</option>
                </select>

                <button
                  onClick={loadUsers}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  title="Rafraîchir"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredUsers.length > 0 ? (
            <DataTable
              data={tableData as any}
              columns={columns as any}
              actions={actions as any}
              getRowId="id"
              rowHref={`/${username}/users/{id}`}
              HeadStyle="bg-[var(--color-quaternary)] text-white font-semibold"
            />
          ) : (
            <div className="text-center py-12 px-4">
              {searchQuery || filterRole !== 'all' || filterStatus !== 'all' ? (
                <>
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Aucun utilisateur trouvé.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterRole('all');
                      setFilterStatus('all');
                    }}
                    className="mt-3 text-sm text-[var(--color-secondary)] hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </>
              ) : (
                <>
                  <UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Aucun utilisateur inscrit pour le moment.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* COMPTEUR */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''}
          {filteredUsers.length !== users.length && (
            <> sur {users.length} au total</>
          )}
        </div>
      </div>
    </div>
  );
}