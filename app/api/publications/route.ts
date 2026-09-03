import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET : Récupérer les publications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const saleType = searchParams.get('saleType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const supabase = createAdminClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('publications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtres
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category && category !== 'all') {
      query = query.eq('main_category', category);
    }
    if (saleType && saleType !== 'all') {
      query = query.eq('sale_type', saleType);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      publications: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error: any) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

// POST : Créer une publication
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    // Validation
    const requiredFields = ['user_id', 'title', 'price', 'main_category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Calculer la date d'expiration
    const durationDays = body.duration_days || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const { data, error } = await supabase
      .from('publications')
      .insert({
        ...body,
        expires_at: expiresAt.toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      publication: data,
    });
  } catch (error: any) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create publication' },
      { status: 500 }
    );
  }
}