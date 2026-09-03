'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Eye,
  Heart,
  ShoppingCart,
  Tag,
  Package,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { AdBanner } from '@/components/shop/AdBanner';

export default function BoutiqueProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/publications/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.publication);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C00]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produit non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/boutique" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h1>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IMAGES */}
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
                          className={`flex-shrink-0 ${activeImage === index ? 'ring-2 ring-[#E86C00]' : ''}`}
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

            {/* INFORMATIONS */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="text-3xl font-bold text-[#E86C00]">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-sm text-gray-500">/ {product.unit}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    ✅ Disponible
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Catégorie :</span>
                  <span className="font-medium">{product.main_category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Quantité :</span>
                  <span className="font-medium">{product.quantity} {product.unit}</span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Localisation :</span>
                    <span className="font-medium">{product.location}</span>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-[#E86C00] text-white rounded-lg font-semibold hover:opacity-90">
                  <ShoppingCart className="h-5 w-5" />
                  Commander
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isFavorite ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 text-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* PUBLICITÉ */}
          <div className="mt-6">
            <AdBanner variant="inline" adId="shop-detail-ad" />
          </div>
        </div>
      </div>
    </div>
  );
}