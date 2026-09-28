'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { OrderList, useOrders, useSales } from '@/features/orders';

type Tab = 'purchases' | 'sales';

export default function OrdersPage() {
  const params = useParams();
  const username = params?.username as string;
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('purchases');

  const { orders, loading: loadingOrders, error: errorOrders } = useOrders(profile?.id);
  const { sales, loading: loadingSales, error: errorSales } = useSales(profile?.id);

  const isSeller = ['producer', 'cooperative', 'supplier'].includes(
    profile?.role || ''
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[var(--afane-green)]">
          Mes commandes
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Suivez vos achats et vos ventes
        </p>
      </div>

      {/* Tabs vendeur */}
      {isSeller && (
        <div className="flex gap-1 mb-5 p-1 bg-[var(--bg-tertiary)] rounded-full">
          <button
            onClick={() => setTab('purchases')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
              tab === 'purchases'
                ? 'bg-[var(--afane-green)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--afane-orange)]'
            }`}
          >
            Mes achats ({orders.length})
          </button>
          <button
            onClick={() => setTab('sales')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
              tab === 'sales'
                ? 'bg-[var(--afane-green)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--afane-orange)]'
            }`}
          >
            Mes ventes ({sales.length})
          </button>
        </div>
      )}

      {/* Erreurs */}
      {(errorOrders || errorSales) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
          <p className="text-xs text-red-700">
            Erreur : {errorOrders || errorSales}
          </p>
        </div>
      )}

      {/* Liste */}
      {tab === 'purchases' ? (
        <OrderList
          orders={orders}
          loading={loadingOrders}
          username={username}
          role="buyer"
          emptyMessage="Aucun achat pour le moment"
        />
      ) : (
        <OrderList
          orders={sales}
          loading={loadingSales}
          username={username}
          role="seller"
          emptyMessage="Aucune vente pour le moment"
        />
      )}
    </div>
  );
}
