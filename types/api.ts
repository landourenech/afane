/* ═══════════════════════════════════════════════════════════
   AFANE 2.0 — Types API
   ═══════════════════════════════════════════════════════════ */

/**
 * Réponse API standard
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paramètres de tri
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paramètres de recherche
 */
export interface SearchParams extends PaginationParams, SortParams {
  search?: string;
  category?: string;
  status?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Erreur API
 */
export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

/**
 * Réponse d'action
 */
export interface ActionResponse {
  success: boolean;
  message?: string;
}