export const APP_CONFIG = {
  // Pagination
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,

  // Uploads
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES: 10,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Publications
  PUBLICATION_DURATIONS: [3, 7, 14, 30] as const,
  PUBLICATION_UNITS: [
    'unité',
    'kg',
    'tonne',
    'sac',
    'carton',
    'pièce',
    'litre',
    'm²',
  ] as const,

  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // Limits
  MAX_PUBLICATIONS_PER_USER: 100,
  MAX_MESSAGE_LENGTH: 1000,
} as const;
