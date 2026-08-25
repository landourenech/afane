'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  Tag,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Calendar,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const productId = params?.id as string;
  const supabase = createClient();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, supabase]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Supprimer cette publication ?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      router.push(`/${username}/products`);
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Produit non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/${username}/products`}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{product.title}</h1>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[activeImage]}
                      alt={product.title}
                      className="w-full aspect-square object-cover"
                    />
                    {product.images.length > 1 && (
                      <div className="flex gap-2 p-2 overflow-x-auto">
                        {product.images.map((image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`flex-shrink-0 ${activeImage === index ? 'ring-2 ring-[var(--color-secondary)]' : ''}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Informations */}
            <div className="space-y-4">
              {/* Prix */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="text-3xl font-bold text-[var(--color-secondary)]">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-sm text-gray-500">
                      / {product.unit}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    product.status === 'active' ? 'bg-green-100 text-green-700' :
                    product.status === 'sold' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status === 'active' ? '✅ Active' :
                     product.status === 'sold' ? '💰 Vendue' :
                     product.status === 'expired' ? '⏰ Expirée' : '❌ Annulée'}
                  </div>
                </div>
              </div>

              {/* Détails */}
              <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Catégorie :</span>
                  <span className="font-medium">{product.main_category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Quantité :</span>
                  <span className="font-medium">{product.quantity} {product.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Type :</span>
                  <span className="font-medium">
                    {product.sale_type === 'group' ? '👥 Vente en groupe' : '🛒 Vente individuelle'}
                  </span>
                </div>
                {product.sale_type === 'group' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Minimum groupe :</span>
                      <span className="font-medium">{product.min_group_quantity} {product.unit}</span>
                    </div>
                    {product.group_price && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Prix de groupe :</span>
                        <span className="font-medium">{product.group_price.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                  </>
                )}
                {product.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Localisation :</span>
                    <span className="font-medium">{product.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Publié le :</span>
                  <span className="font-medium">
                    {new Date(product.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {product.expires_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Expire le :</span>
                    <span className="font-medium">
                      {new Date(product.expires_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href={`/${username}/products/${productId}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}