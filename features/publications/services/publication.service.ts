import { createClient } from '@/lib/supabase/client';
import { Publication, CreatePublicationInput } from '../types';

export class PublicationService {
  static async getAll(): Promise<Publication[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Publication[];
  }

  static async getByUser(userId: string): Promise<Publication[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Publication[];
  }

  static async getById(id: string): Promise<Publication | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Publication | null;
  }

  static async create(input: CreatePublicationInput, userId: string): Promise<Publication> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Publication;
  }

  static async delete(id: string, userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
