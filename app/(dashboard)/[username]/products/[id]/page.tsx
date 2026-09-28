'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft, Package, MapPin, Calendar, Tag,
  ShoppingCart, Pencil, Trash2, Share2, Heart,
  Users, AlertCircle,
} from 'lucide-react';
import { ContactSellerButton } from '@/features/messages';
import { GroupSaleCard, ProposalModal } from '@/features/marketplace';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ProductDetailPage() {
  const { profile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const productId = params?.id as string;
  const supabase = createClient();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);   /* ✅ ICI */

  useEffect(() => {
    const load = async () => {
      if (!productId || !UUID_REGEX.test(productId)) {
        setError('Ce produit n\'est pas disponible (ID invalide)');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('publications')
          .select('*')
          .eq('id', productId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Produit introuvable');
          setLoading(false);
          return;
        }

        setProduct(data);

        if (data?.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, display_name, username, avatar_url, city, region')
            .eq('id', data.user_id)
            .maybeSingle();
          setSeller(profileData);
        }
      } catch (err: any) {
        console.error('Erreur:', err);
        setError('Impossible de charger ce produit');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId, supabase]);

  const handleDelete = async () => {
    if (!confirm('Supprimer cette publication ?')) return;
    await supabase.from('publications').delete().eq('id', productId);
    router.push(`/${username}/products`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--border-primary)] border-t-[var(--afane-orange)]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-[var(--afane-orange)]/10 rounded-full mb-4">
            <AlertCircle className="h-10 w-10 text-[var(--afane-orange)]" />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            {error || 'Produit introuvable'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-5">
            Ce produit n'existe pas ou a été retiré.
          </p>
          <Link
            href={`/${username}/explore`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--afane-green)] text-white text-sm font-semibold rounded-full hover:bg-[var(--afane-orange)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = profile?.id === product.user_id;
  const images = product.images || [];
  const isGroupSale = product.sale_type === 'group';

  return (
    <div className="min-h-full bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
          </button>
          <h1 className="flex-1 text-base font-semibold text-[var(--text-primary)] truncate">
            {product.title}
          </h1>
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors">
            <Share2 className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
          <button onClick={() => setFavorited(!favorited)} className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors">
            <Heart className={`h-5 w-5 transition-colors ${favorited ? 'fill-[var(--afane-orange)] text-[var(--afane-orange)]' : 'text-[var(--text-secondary)]'}`} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Galerie */}
          <div className="space-y-3">
            <div className="aspect-square bg-[var(--bg-primary)] rounded-2xl overflow-hidden border border-[var(--border-primary)]">
              {images[activeImage] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-20 w-20 text-[var(--text-tertiary)]" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-[var(--afane-orange)]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="space-y-4">
            <div className="bg-[var(--bg-primary)] rounded-2xl p-5 border border-[var(--border-primary)]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-[var(--afane-green)]">
                    {product.price?.toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)]">par {product.unit}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.status === 'active' ? 'bg-green-100 text-green-700' :
                  product.status === 'sold' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {product.status === 'active' ? '● Disponible' :
                   product.status === 'sold' ? '● Vendue' : '● Indisponible'}
                </span>
              </div>

              {isGroupSale && (
                <div className="flex items-center gap-2 text-xs text-[var(--afane-orange)] font-semibold">
                  <Users className="h-3.5 w-3.5" />
                  Vente groupée disponible
                </div>
              )}
            </div>

            {seller && (
              <div className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border-primary)]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Vendu par
                </p>
                <Link href={`/${seller.username || seller.id}`} className="flex items-center gap-3 group">
                  {seller.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={seller.avatar_url} alt={seller.display_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--afane-green)] flex items-center justify-center text-white font-bold">
                      {(seller.display_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--afane-orange)] transition-colors truncate">
                      {seller.display_name || 'Vendeur'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      @{seller.username} · {seller.city || seller.region}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {!isOwner ? (
              <div className="space-y-2">
                <button
                  onClick={() => console.log('Ajouter au panier')}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--afane-green)] text-white font-bold rounded-full hover:bg-[var(--afane-orange)] transition-colors active:scale-[0.98]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ajouter au panier
                </button>

                <ContactSellerButton
                  sellerId={product.user_id}
                  sellerName={seller?.display_name}
                  productTitle={product.title}
                  variant="outline"
                />

                {/* Bouton proposer vente collective */}
                {!isGroupSale && (
                  <button
                    onClick={() => setProposalOpen(true)}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--afane-orange)]/10 text-[var(--afane-orange)] border-2 border-[var(--afane-orange)]/30 font-bold rounded-full hover:bg-[var(--afane-orange)] hover:text-white transition-all active:scale-[0.98]"
                  >
                    <Users className="h-5 w-5" />
                    Proposer une vente collective
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href={`/${username}/products/${productId}/edit`}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold rounded-full hover:bg-[var(--afane-orange)] hover:text-white transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            )}

            {isGroupSale && !isOwner && (
              <GroupSaleCard
                publicationId={product.id}
                basePrice={product.price}
                groupPrice={product.group_price || product.price}
                minQuantity={product.min_group_quantity || 10}
                bulkDiscount={product.bulk_discount || 0}
                unit={product.unit}
                sellerId={product.user_id}
              />
            )}
          </div>
        </div>

        {/* Détails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border-primary)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Catégorie</p>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[var(--afane-orange)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">{product.main_category || '—'}</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border-primary)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Localisation</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--afane-orange)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">{product.location || '—'}</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border-primary)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Publié le</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--afane-orange)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {new Date(product.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-6 bg-[var(--bg-primary)] rounded-2xl p-5 border border-[var(--border-primary)]">
            <h2 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-[var(--afane-orange)]" />
              Description
            </h2>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* Modal proposition collective */}
      <ProposalModal
        isOpen={proposalOpen}
        onClose={() => setProposalOpen(false)}
        publication={{
          id: product.id,
          title: product.title,
          price: product.price,
          unit: product.unit,
        }}
      />
    </div>
  );
}
