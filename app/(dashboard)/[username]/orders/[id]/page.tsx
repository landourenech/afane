'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from 'lucide-react';

export default function OrderDetailPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const orderId = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            publication:publications(*),
            buyer:profiles!orders_buyer_id_fkey(*),
            seller:profiles!orders_seller_id_fkey(*)
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, supabase]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Commande non trouvée.</p>
      </div>
    );
  }

  const isSeller = profile?.id === order.seller_id;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href={`/${username}/orders`} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Détail de la commande</h1>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Statut */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Statut de la commande</p>
                <p className="text-2xl font-bold">
                  {order.status === 'pending' ? '⏳ En attente' :
                   order.status === 'confirmed' ? '✅ Confirmée' :
                   order.status === 'shipped' ? '🚚 Expédiée' :
                   order.status === 'delivered' ? '📦 Livrée' : '❌ Annulée'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {order.payment_status === 'paid' ? '💰 Payé' : '⏳ Paiement en attente'}
              </span>
            </div>
          </div>

          {/* Produit */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Produit</h2>
            <div className="flex items-center gap-4">
              {order.publication?.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={order.publication.images[0]}
                  alt={order.publication.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-medium">{order.publication?.title}</p>
                <p className="text-sm text-gray-500">
                  Quantité : {order.quantity} {order.publication?.unit}
                </p>
                <p className="text-lg font-bold text-[var(--color-secondary)] mt-1">
                  {order.total_amount?.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </div>
          </div>

          {/* Informations acheteur/vendeur */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-900 mb-3">
              {isSeller ? 'Acheteur' : 'Vendeur'}
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {isSeller ? order.buyer?.display_name : order.seller?.display_name}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {isSeller ? order.buyer?.email : order.seller?.email}
              </p>
              {(isSeller ? order.buyer?.phone : order.seller?.phone) && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {isSeller ? order.buyer?.phone : order.seller?.phone}
                </p>
              )}
            </div>
          </div>

          {/* Actions pour le vendeur */}
          {isSeller && order.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus('confirmed')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmer la commande
              </button>
              <button
                onClick={() => handleUpdateStatus('cancelled')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <XCircle className="h-4 w-4" />
                Annuler
              </button>
            </div>
          )}

          {isSeller && order.status === 'confirmed' && (
            <button
              onClick={() => handleUpdateStatus('shipped')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Truck className="h-4 w-4" />
              Marquer comme expédiée
            </button>
          )}

          {/* Date */}
          <div className="text-center text-sm text-gray-500">
            Commande passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}