import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET : Récupérer tous les utilisateurs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = createAdminClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }
    if (status && status !== 'all') {
      query = query.eq('verification_status', status);
    }
    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      users: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}