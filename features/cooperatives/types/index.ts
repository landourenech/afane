export type CooperativeRole = 'president' | 'treasurer' | 'secretary' | 'member';
export type CooperativeStatus = 'active' | 'pending' | 'suspended' | 'archived';

export interface Cooperative {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  founded_year: number | null;
  registration_number: string | null;
  member_count: number;
  product_count: number;
  status: CooperativeStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CooperativeMember {
  id: string;
  cooperative_id: string;
  user_id: string;
  role: CooperativeRole;
  joined_at: string;
  contribution_share: number;
  user?: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    city: string | null;
    region: string | null;
  };
}

export interface CooperativeFilters {
  search: string;
  regions: string[];
  status: CooperativeStatus | null;
  sort: 'recent' | 'members' | 'name';
}

export const ROLE_LABELS: Record<CooperativeRole, string> = {
  president: 'Président',
  treasurer: 'Trésorier',
  secretary: 'Secrétaire',
  member: 'Membre',
};

export const ROLE_COLORS: Record<CooperativeRole, string> = {
  president: 'bg-yellow-100 text-yellow-700',
  treasurer: 'bg-blue-100 text-blue-700',
  secretary: 'bg-purple-100 text-purple-700',
  member: 'bg-gray-100 text-gray-700',
};
