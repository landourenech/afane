import type { UserRole } from '@/types/user';

/**
 * Permissions par rôle.
 * Utilisé pour vérifier les accès côté client et serveur.
 */
export const PERMISSIONS = {
  // Publications
  canCreatePublication: [
    'user',
    'producer',
    'cooperative',
    'supplier',
  ] as UserRole[],
  canEditOwnPublication: [
    'user',
    'producer',
    'cooperative',
    'supplier',
  ] as UserRole[],
  canDeleteOwnPublication: [
    'user',
    'producer',
    'cooperative',
    'supplier',
  ] as UserRole[],

  // Commandes
  canCreateOrder: ['user', 'buyer', 'cooperative'] as UserRole[],
  canViewOwnOrders: [
    'user',
    'producer',
    'cooperative',
    'buyer',
    'supplier',
  ] as UserRole[],

  // Conseils
  canPublishAdvice: ['advisor', 'admin'] as UserRole[],

  // Administration
  canManageUsers: ['admin'] as UserRole[],
  canViewStats: ['admin'] as UserRole[],
  canModerate: ['admin'] as UserRole[],
} as const;

/**
 * Vérifie si un rôle a une permission.
 */
export function hasPermission(
  role: UserRole,
  permission: keyof typeof PERMISSIONS
): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return (allowedRoles as readonly UserRole[]).includes(role);
}

/**
 * Vérifie si un utilisateur peut modifier une ressource.
 */
export function canEditResource(
  userId: string,
  resourceOwnerId: string,
  role: UserRole
): boolean {
  // Propriétaire
  if (userId === resourceOwnerId) return true;
  // Admin
  if (role === 'admin') return true;
  return false;
}
