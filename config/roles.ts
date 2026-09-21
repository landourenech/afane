import type { UserRole } from '@/types/user';

export const ROLES: Record<
  UserRole,
  {
    label: string;
    emoji: string;
    color: string;
    description: string;
  }
> = {
  user: {
    label: 'Utilisateur',
    emoji: '👤',
    color: 'gray',
    description: 'Utilisateur de base',
  },
  producer: {
    label: 'Producteur',
    emoji: '🌾',
    color: 'green',
    description: 'Producteur agricole',
  },
  cooperative: {
    label: 'Coopérative',
    emoji: '🤝',
    color: 'blue',
    description: 'Coopérative agricole',
  },
  buyer: {
    label: 'Acheteur',
    emoji: '🛒',
    color: 'orange',
    description: 'Acheteur de produits',
  },
  supplier: {
    label: 'Fournisseur',
    emoji: '🏭',
    color: 'purple',
    description: "Fournisseur d'intrants",
  },
  advisor: {
    label: 'Conseiller',
    emoji: '📋',
    color: 'yellow',
    description: 'Conseiller agricole',
  },
  admin: {
    label: 'Admin',
    emoji: '🛡️',
    color: 'red',
    description: 'Administrateur',
  },
} as const;

export const PERMISSIONS = {
  canCreatePublication: ['user', 'producer', 'cooperative', 'supplier'],
  canCreateOrder: ['user', 'buyer', 'cooperative'],
  canPublishAdvice: ['advisor', 'admin'],
  canManageUsers: ['admin'],
  canViewStats: ['admin'],
} as const satisfies Record<string, readonly UserRole[]>;
