import { createClient } from '@/lib/supabase/client';
import type {
  Product,
  MarketplaceFilters,
  SellerType,
  ProductBadge,
  DeliveryMode,
} from '../types';

export interface PriceBounds {
  min: number;
  max: number;
}

export const marketplaceService = {
  /* ✅ Calcule les bornes de prix réelles depuis la DB */
  async getPriceBounds(): Promise<PriceBounds> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('publications')
      .select('price')
      .eq('status', 'active');

    if (error || !data || data.length === 0) {
      return { min: 0, max: 100000 };
    }

    const prices = data.map((r: any) => Number(r.price)).filter((p) => p > 0);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    /* Arrondi "propre" */
    const step = max > 100000 ? 10000 : max > 10000 ? 1000 : 100;
    const roundedMin = Math.floor(min / step) * step;
    const roundedMax = Math.ceil(max / step) * step;

    return {
      min: roundedMin,
      max: roundedMax,
    };
  },

  async getProducts(filters: MarketplaceFilters): Promise<Product[]> {
    const supabase = createClient();

    let query = supabase
      .from('publications')
      .select(`
        id,
        title,
        description,
        images,
        price,
        quantity,
        unit,
        main_category,
        location,
        status,
        sale_type,
        group_price,
        min_group_quantity,
        bulk_discount,
        created_at,
        user_id,
        seller:profiles!publications_user_id_fkey(
          id,
          display_name,
          username,
          avatar_url,
          role,
          city,
          region,
          verification_status
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(200);

    if (filters.categories.length > 0) {
      query = query.in('main_category', filters.categories);
    }

    if (filters.regions.length > 0) {
      query = query.in('location', filters.regions);
    }

    /* ✅ Filtre prix dynamique — ignoré si les 2 bornes sont identiques (par défaut) */
    const isDefaultPrice =
      filters.price_min === 0 && filters.price_max === 0;

    if (!isDefaultPrice) {
      query = query
        .gte('price', filters.price_min)
        .lte('price', filters.price_max);
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getProducts error:', error);
      return [];
    }

    console.log('📦 getProducts:', data?.length || 0, 'produits chargés');

    let products: Product[] = (data || []).map((row: any) => {
      const seller = Array.isArray(row.seller) ? row.seller[0] : row.seller;

      const badges: ProductBadge[] = [];
      if (row.sale_type === 'group') badges.push('exclusive');
      if (seller?.verification_status === 'verified') badges.push('premium');

      return {
        id: row.id,
        title: row.title,
        image_url: row.images?.[0] || '/produits.png',
        price_per_kg: Number(row.price),
        currency: 'FCFA',
        quantity_available: Number(row.quantity),
        unit: row.unit as any,
        rating: 4.5,
        reviews_count: 0,
        seller: {
          id: seller?.id || row.user_id,
          name: seller?.display_name || 'Vendeur',
          avatar_url: seller?.avatar_url || null,
          type: (seller?.role || 'producer') as SellerType,
          verified: seller?.verification_status === 'verified',
        },
        location: {
          city: row.location || seller?.city || '',
          region: seller?.region || '',
          country: 'Gabon',
        },
        badges,
        category: row.main_category || 'autre',
        delivery_modes: ['pickup', 'delivery'] as DeliveryMode[],
        in_stock: Number(row.quantity) > 0,
      };
    });

    if (filters.seller_types.length > 0) {
      products = products.filter((p) =>
        filters.seller_types.includes(p.seller.type)
      );
    }

    if (filters.badges.length > 0) {
      products = products.filter((p) =>
        filters.badges.some((b) => p.badges.includes(b))
      );
    }

    switch (filters.sort) {
      case 'price_asc':
        products.sort((a, b) => a.price_per_kg - b.price_per_kg);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price_per_kg - a.price_per_kg);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        products.sort((a, b) => b.reviews_count - a.reviews_count);
        break;
    }

    return products;
  },
};
