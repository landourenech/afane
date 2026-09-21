import { createClient } from '@/lib/supabase/client';
import type { User, UserSearchResult } from '../types';

export const userService = {
  async getByUsername(username: string): Promise<User | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data as User | null;
  },

  async search(query: string, limit = 8): Promise<UserSearchResult[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, role')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data as UserSearchResult[];
  },
};
