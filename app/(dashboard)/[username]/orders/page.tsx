'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { DataTable } from '@/components/shared/table';
import { 
  ShoppingCart, 
  Search, 
  Filter,
  X,
  RefreshCw,
  Eye,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  publication_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  publication?: {
    title: string;
    images: string[];
    unit: string;
  };
  buyer?: {
    display_name: string;
    username: string;
    email: string;
  };
  seller?: {
    display_name: string;
    username: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  totalRevenue: number;
}

export default function OrdersPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, buying, selling
  const [showFilters, setShowFilters] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    try {
      // Charger les commandes où l'utilisateur est acheteur ou vendeur
      const response = await fetch(`/api/orders?userId=${profile.id}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        const ordersList: Order[] = data.orders || [];
        setOrders(ordersList);
        setFilteredOrders(ordersList);

        // Statistiques
        setStats({
          total: ordersList.length,
          pending: ordersList.filter((o: Order) => o.status === 'pending').length,
          confirmed: ordersList.filter((o: Order) => o.status === 'confirmed').length,
          delivered: ordersList.filter((o: Order) => o.status === 'delivered').length,
          totalRevenue: ordersList
            .filter((o: Order) => o.status === 'delivered' && o.payment_status === 'paid')
            .reduce((sum: number, o: Order) => sum + (o.total_amount || 0), 0),
        });
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const filtered = orders.filter((order: Order) => {
      const matchesSearch = 
        (order.publication?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.buyer?.display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.seller?.display_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [orders, searchQuery, filterStatus]);

  const columns = [
    { 
      key: 'product' as const, 
      label: 'Produit',
      href: `/${username}/orders/{id}`
    },
    { 
      key: 'quantity' as const, 
      label: 'Quantité' 
    },
    { 
      key: 'total_amount' as const, 
      label: 'Total' 
    },
    { 
      key: 'status' as const, 
      label: 'Statut' 
    },
    { 
      key: 'payment_status' as const, 
      label: 'Paiement' 
    },
    { 
      key: 'created_at' as const, 
      label: 'Date' 
    },
  ];

  const actions = [
    { label: 'Voir détails', icon: 'eye' as const, href: `/${username}/orders/{id}` },
  ];

  const tableData = filteredOrders.map((order: Order) => ({
    id: order.id,
    product: order.publication?.title || 'Produit',
    quantity: `${order.quantity} ${order.publication?.unit || 'unité'}`,
    total_amount: `${order.total_amount?.toLocaleString('fr-FR') || 0} FCFA`,
    status: order.status === 'pending' ? '⏳ En attente' :
            order.status === 'confirmed' ? '✅ Confirmée' :
            order.status === 'shipped' ? '🚚 Expédiée' :
            order.status === 'delivered' ? '📦 Livrée' : '❌ Annulée',
    payment_status: order.payment_status === 'paid' ? '💰 Payé' :
                    order.payment_status === 'pending' ? '⏳ En attente' : '↩️ Remboursé',
    created_at: new Date(order.created_at).toLocaleDateString('fr-FR', {
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
            <h1 className="text-xl font-bold text-gray-900">Commandes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.total} commande{stats.total > 1 ? 's' : ''}
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
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">En attente</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Confirmées</p>
                <p className="text-xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Livrées</p>
                <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>
        </div>

        {/* REVENU */}
        <div className="bg-gradient-to-r from-[var(--color-quaternary)] to-[var(--color-secondary)] rounded-lg shadow p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Revenu total</p>
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
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une commande..."
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
                className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </button>

              <div className={`${showFilters ? 'flex' : 'hidden'} md:flex gap-3`}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">⏳ En attente</option>
                  <option value="confirmed">✅ Confirmées</option>
                  <option value="shipped">🚚 Expédiées</option>
                  <option value="delivered">📦 Livrées</option>
                  <option value="cancelled">❌ Annulées</option>
                </select>

                <button
                  onClick={loadOrders}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredOrders.length > 0 ? (
            <DataTable
              data={tableData as any}
              columns={columns as any}
              actions={actions as any}
              getRowId="id"
              rowHref={`/${username}/orders/{id}`}
              HeadStyle="bg-[var(--color-quaternary)] text-white font-semibold"
            />
          ) : (
            <div className="text-center py-12 px-4">
              {searchQuery || filterStatus !== 'all' ? (
                <>
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Aucune commande trouvée.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                    }}
                    className="mt-3 text-sm text-[var(--color-secondary)] hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Aucune commande pour le moment.</p>
                  <Link
                    href={`/${username}/explore`}
                    className="inline-block mt-4 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:opacity-90"
                  >
                    Explorer les produits
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}