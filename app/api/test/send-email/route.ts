import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const supabase = createAdminClient();
    
    // Envoyer un email de test via Supabase
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
    
    if (error) {
      console.error('Erreur envoi email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email envoyé',
      data 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}