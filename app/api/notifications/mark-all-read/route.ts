import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST : Marquer toutes comme lues
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Toutes les notifications sont marquées comme lues',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}