import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { uid, email, displayName, photoURL } = await request.json();
    
    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID et email sont requis' },
        { status: 400 }
      );
    }

    console.log('Sync - Starting:', { uid, email });

    const supabase = createAdminClient();

    // 1. Chercher le profil par firebase_uid
    const { data: existingByUid } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', uid)
      .maybeSingle();

    if (existingByUid) {
      console.log('Sync - Profile found by uid');
      return NextResponse.json({ 
        success: true, 
        profile: existingByUid 
      });
    }

    // 2. Chercher le profil par email
    const { data: existingByEmail } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingByEmail) {
      console.log('Sync - Profile found by email, updating uid');
      
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ firebase_uid: uid })
        .eq('email', email)
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json({ 
        success: true, 
        profile: updated 
      });
    }

    // 3. Chercher l'utilisateur Auth
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const authUser = users.find(u => u.email === email);

    if (authUser) {
      console.log('Sync - Auth user found:', authUser.id);
      
      // Créer le profil avec l'ID Auth
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          firebase_uid: uid,
          email,
          display_name: displayName,
          avatar_url: photoURL,
          role: 'user',
          onboarding_completed: false,
        })
        .select()
        .single();

      if (insertError) {
        // Si erreur, essayer de récupérer le profil
        const { data: existing } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (existing) {
          return NextResponse.json({ 
            success: true, 
            profile: existing 
          });
        }
        throw insertError;
      }

      return NextResponse.json({ 
        success: true, 
        profile: newProfile 
      });
    }

    // 4. Créer un nouvel utilisateur Auth
    console.log('Sync - Creating new auth user');
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: uid,
      email_confirm: true,
    });

    if (authError) {
      console.error('Sync - Auth error:', authError.message);
      
      // Récupérer l'utilisateur existant
      const { data: { users: allUsers } } = await supabase.auth.admin.listUsers();
      const existingUser = allUsers.find(u => u.email === email);
      
      if (existingUser) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: existingUser.id,
            firebase_uid: uid,
            email,
            display_name: displayName,
            avatar_url: photoURL,
            role: 'user',
            onboarding_completed: false,
          })
          .select()
          .single();

        if (insertError) {
          const { data: existing } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingUser.id)
            .maybeSingle();

          if (existing) {
            return NextResponse.json({ 
              success: true, 
              profile: existing 
            });
          }
          throw insertError;
        }

        return NextResponse.json({ 
          success: true, 
          profile: newProfile 
        });
      }
      
      throw authError;
    }

    // 5. Créer le profil
    console.log('Sync - Auth user created:', authData.user.id);
    
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        firebase_uid: uid,
        email,
        display_name: displayName,
        avatar_url: photoURL,
        role: 'user',
        onboarding_completed: false,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return NextResponse.json({ 
      success: true, 
      profile: newProfile 
    });

  } catch (error: any) {
    console.error('Sync - Error:', error.message || error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to sync user',
        code: error.code
      },
      { status: 500 }
    );
  }
}