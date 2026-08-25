import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET : Statistiques des publications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const supabase = createAdminClient();

    let baseQuery = supabase
      .from('publications')
      .select('*', { count: 'exact', head: true });

    if (userId) {
      baseQuery = baseQuery.eq('user_id', userId);
    }

    const [
      { count: total },
      { count: active },
      { count: sold },
      { count: expired },
      { count: cancelled },
      { count: groupSales },
    ] = await Promise.all([
      baseQuery,
      baseQuery.eq('status', 'active'),
      baseQuery.eq('status', 'sold'),
      baseQuery.eq('status', 'expired'),
      baseQuery.eq('status', 'cancelled'),
      baseQuery.eq('sale_type', 'group'),
    ]);

    // Revenu total des ventes
    const { data: revenueData } = await supabase
      .from('publications')
      .select('price, quantity')
      .eq('status', 'sold');

    const totalRevenue = revenueData?.reduce((sum, pub) => {
      return sum + (pub.price * pub.quantity);
    }, 0) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        total: total || 0,
        active: active || 0,
        sold: sold || 0,
        expired: expired || 0,
        cancelled: cancelled || 0,
        groupSales: groupSales || 0,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}