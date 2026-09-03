import { createAdminClient } from '@/lib/supabase/admin';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  content: string,
  link?: string
) {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        content,
        link,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

// Notifications spécifiques
export async function notifyPublicationCreated(userId: string, publicationTitle: string, publicationId: string) {
  return createNotification(
    userId,
    'publication_created',
    'Publication créée',
    `Votre publication "${publicationTitle}" a été créée avec succès.`,
    `/publications/${publicationId}`
  );
}

export async function notifyPublicationSold(userId: string, publicationTitle: string, publicationId: string) {
  return createNotification(
    userId,
    'publication_sold',
    'Publication vendue 🎉',
    `Félicitations ! Votre publication "${publicationTitle}" a été vendue.`,
    `/publications/${publicationId}`
  );
}

export async function notifyPublicationExpired(userId: string, publicationTitle: string) {
  return createNotification(
    userId,
    'publication_expired',
    'Publication expirée',
    `Votre publication "${publicationTitle}" a expiré.`,
    '/products'
  );
}