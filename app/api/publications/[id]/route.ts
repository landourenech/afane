import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET : Récupérer une publication
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('publications')
      .select(`
        *,
        owner:profiles!publications_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          phone,
          region,
          city
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Incrémenter les vues
    await supabase
      .from('publications')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      publication: data,
    });
  } catch (error: any) {
    console.error('Error fetching publication:', error);
    return NextResponse.json(
      { error: error.message || 'Publication not found' },
      { status: 404 }
    );
  }
}

// PUT : Mettre à jour une publication
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    // Vérifier que la publication existe
    const { data: existing, error: existingError } = await supabase
      .from('publications')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: 'Publication non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour
    const { data, error } = await supabase
      .from('publications')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      publication: data,
    });
  } catch (error: any) {
    console.error('Error updating publication:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update publication' },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer une publication
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Publication supprimée',
    });
  } catch (error: any) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete publication' },
      { status: 500 }
    );
  }
}