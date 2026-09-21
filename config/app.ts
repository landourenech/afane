export const APP_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,

  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  MAX_IMAGES: 10,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  PUBLICATION_DURATIONS: [3, 7, 14, 30] as const,
  PUBLICATION_UNITS: ['unité', 'kg', 'tonne', 'sac', 'carton', 'pièce', 'litre', 'm²'] as const,
  PUBLICATION_CATEGORIES: [
    { id: 'produits-agricoles', label: 'Produits agricoles' },
    { id: 'fruits-legumes', label: 'Fruits et légumes' },
    { id: 'betail-volaille', label: 'Bétail et volaille' },
    { id: 'semences-plants', label: 'Semences et plants' },
    { id: 'intrants', label: 'Intrants agricoles' },
    { id: 'equipements', label: 'Équipements' },
    { id: 'immobilier', label: 'Immobilier agricole' },
    { id: 'produits-transformes', label: 'Produits transformés' },
    { id: 'peche', label: 'Produits de la pêche' },
    { id: 'services', label: 'Services agricoles' },
  ] as const,

  CACHE_DURATION: 5 * 60 * 1000,
  REVALIDATE_TIME: 60,

  MAX_PUBLICATIONS_PER_USER: 100,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_BIO_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,

  COOKIE_NAMES: {
    SYNC_UID: 'kc_sync_uid',
    SYNC_TIME: 'kc_sync_time',
    PROFILE_ID: 'kc_profile_id',
    USER_ROLE: 'kc_user_role',
    ONBOARDING_DONE: 'kc_onboarding_done',
    COOKIE_CONSENT: 'cookie_consent',
  },
  COOKIE_DURATION: 7,

  PUBLIC_ROUTES: [
    '/',
    '/login',
    '/onboarding',
    '/boutique',
    '/carte',
    '/conseil',
    '/apropos',
    '/faq',
    '/contact',
    '/newsletter',
    '/help',
    '/cookie-policy',
    '/legal',
    '/privacy',
    '/terms',
  ],

  GABON_REGIONS: [
    'Estuaire',
    'Haut-Ogooué',
    'Moyen-Ogooué',
    'Ngounié',
    'Nyanga',
    'Ogooué-Ivindo',
    'Ogooué-Lolo',
    'Ogooué-Maritime',
    'Woleu-Ntem',
  ] as const,
} as const;

export type AppConfig = typeof APP_CONFIG;
