import type { UserProfile } from '@/types/user';

export type User = UserProfile;

export interface UserSearchResult {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  role: string;
}
