import { createClient } from '@/lib/supabase/client';
import type { UserPreferences } from '../types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr',
  region: 'GA',
  notifications: {
    email: true,
    push: true,
    sounds: true,
    messages: true,
    orders: true,
    marketing: false,
  },
  privacy: {
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: 'everyone',
  },
  chats: {
    wallpaper: 'default',
    fontSize: 'medium',
  },
};

export const settingsService = {
  async getPreferences(userId: string): Promise<UserPreferences> {
    const supabase = createClient();
    const { data } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .maybeSingle();

    return (data?.preferences as UserPreferences) || DEFAULT_PREFERENCES;
  },

  async savePreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<void> {
    const supabase = createClient();
    await supabase.from('user_preferences').upsert({
      user_id: userId,
      preferences,
      updated_at: new Date().toISOString(),
    });
  },
};

export { DEFAULT_PREFERENCES };
