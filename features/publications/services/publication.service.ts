import { createClient } from '@/lib/supabase/client';
import type { Publication } from '../types';
import type { CreatePublicationInput } from '../schemas/publication.schema';

export const publicationService = {
  async getAll(limit = 50): Promise<Publication[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .select('*, seller:profiles(display_name, username, avatar_url)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Publication[];
  },

  async getByUser(userId: string): Promise<Publication[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Publication[];
  },

  async getById(id: string): Promise<Publication | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .select('*, seller:profiles(display_name, username, avatar_url)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Publication | null;
  },

  async create(input: CreatePublicationInput, userId: string): Promise<Publication> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Publication;
  },

  async update(id: string, input: Partial<CreatePublicationInput>, userId: string): Promise<Publication> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Publication;
  },

  async delete(id: string, userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
