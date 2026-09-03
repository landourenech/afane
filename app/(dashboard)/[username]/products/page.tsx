'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/dashboard/table';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle, 
  TrendingUp, 
  Users,
  DollarSign,
  Filter,
  X,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Layers,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Publication {
  id: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  main_category: string;
  sale_type: 'individual' | 'group';
  status: 'active' | 'expired' | 'sold' | 'cancelled';
  views_count: number;
  created_at: string;
  expires_at: string;
  images?: string[];
}

interface Stats {
  total: number;
  active: number;
  sold: number;
  expired: number;
  cancelled: number;
  groupSales: number;
  totalRevenue: number;
}

export default function ProductsPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  // États
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    sold: 0,
    expired: 0,
    cancelled: 0,
    groupSales: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Charger les données
  const loadData = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    try {
      // Charger les statistiques
      const statsResponse = await fetch(`/api/publications/stats?userId=${profile.id}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Charger les publications
      const pubsResponse = await fetch(`/api/publications?userId=${profile.id}&limit=100`);
      if (pubsResponse.ok) {
        const pubsData = await pubsResponse.json();
        setPublications(pubsData.publications || []);
        setFilteredPublications(pubsData.publications || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrer les publications
  useEffect(() => {
    const filtered = publications.filter((pub) => {
      const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (pub.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || pub.status === filterStatus;
      const matchesType = filterType === 'all' || pub.sale_type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredPublications(filtered);
  }, [publications, searchQuery, filterStatus, filterType]);

  // Supprimer une publication
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?');
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteId(id);

    try {
      const response = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPublications(prev => prev.filter(p => p.id !== id));
        setFilteredPublications(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Colonnes du tableau
  const columns = [
    { 
      key: 'title' as const, 
      label: 'Produit',
      href: `/${username}/products/{id}`
    },
    { 
      key: 'price' as const, 
      label: 'Prix' 
    },
    { 
      key: 'quantity' as const, 
      label: 'Quantité' 
    },
    { 
      key: 'main_category' as const, 
      label: 'Catégorie' 
    },
    { 
      key: 'sale_type' as const, 
      label: 'Type' 
    },
    { 
      key: 'status' as const, 
      label: 'Statut' 
    },
    { 
      key: 'created_at' as const, 
      label: 'Publié le' 
    },
  ];

  // Actions
  const actions = [
    { label: 'Voir', icon: 'eye' as const, href: `/${username}/products/{id}` },
    { label: 'Modifier', icon: 'pencil' as const, href: `/${username}/products/{id}/edit` },
    { label: 'Supprimer', icon: 'trash' as const, variant: 'destructive' as const },
  ];

  // Formater les données pour le tableau
  const tableData = filteredPublications.map(pub => ({
    id: pub.id,
    title: pub.title,
    price: `${pub.price.toLocaleString('fr-FR')} FCFA`,
    quantity: `${pub.quantity} ${pub.unit}`,
    main_category: pub.main_category,
    sale_type: pub.sale_type === 'group' ? '👥 Groupe' : '🛒 Individuel',
    status: pub.status === 'active' ? '✅ Active' : 
            pub.status === 'sold' ? '💰 Vendu' : 
            pub.status === 'expired' ? '⏰ Expiré' : '❌ Annulée',
    created_at: new Date(pub.created_at).toLocaleDateString('fr-FR', {
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
            <h1 className="text-xl font-bold text-gray-900">Mes Produits</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.total} publication{stats.total > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href={`/${username}/products/publish`}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Publier</span>
          </Link>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* STATISTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
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
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Actives</p>
                <p className="text-xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Vendues</p>
                <p className="text-xl font-bold text-gray-900">{stats.sold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">En groupe</p>
                <p className="text-xl font-bold text-gray-900">{stats.groupSales}</p>
              </div>
            </div>
          </div>
        </div>

        {/* REVENU TOTAL */}
        <div className="bg-gradient-to-r from-[var(--color-quaternary)] to-[var(--color-secondary)] rounded-lg shadow p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Revenu total des ventes</p>
              <p className="text-2xl font-bold">
                {stats.totalRevenue.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <DollarSign className="h-10 w-10 opacity-50" />
          </div>
        </div>

        {/* FILTRES */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
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

              {/* Bouton filtres mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </button>

              {/* Filtres desktop et mobile */}
              <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-3`}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">✅ Actives</option>
                  <option value="sold">💰 Vendues</option>
                  <option value="expired">⏰ Expirées</option>
                  <option value="cancelled">❌ Annulées</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                >
                  <option value="all">Tous les types</option>
                  <option value="individual">🛒 Individuel</option>
                  <option value="group">👥 En groupe</option>
                </select>

                <button
                  onClick={loadData}
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
          {filteredPublications.length > 0 ? (
            <DataTable
              data={tableData as any}
              columns={columns as any}
              actions={actions as any}
              getRowId="id"
              rowHref={`/${username}/products/{id}`}
              HeadStyle="bg-[var(--color-quaternary)] text-white font-semibold"
            />
          ) : (
            <div className="text-center py-12 px-4">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all' ? (
                <>
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Aucun résultat trouvé.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                      setFilterType('all');
                    }}
                    className="mt-3 text-sm text-[var(--color-secondary)] hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </>
              ) : (
                <>
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Vous n'avez pas encore de publication.</p>
                  <Link
                    href={`/${username}/products/publish`}
                    className="inline-block mt-4 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:opacity-90"
                  >
                    Publier ma première offre
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* COMPTEUR */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {filteredPublications.length} publication{filteredPublications.length > 1 ? 's' : ''} affichée{filteredPublications.length > 1 ? 's' : ''}
          {filteredPublications.length !== publications.length && (
            <> sur {publications.length} au total</>
          )}
        </div>
      </div>
    </div>
  );
}