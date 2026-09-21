export const siteConfig = {
  name: 'AFANE',
  description: 'La plateforme agricole numérique du Gabon',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://afane.ga',
  logo: '/logo.png',
  email: 'contact@afane.ga',
  phone: '+241 XX XX XX XX',
  social: {
    facebook: 'https://facebook.com/afane',
    twitter: 'https://twitter.com/afane',
    instagram: 'https://instagram.com/afane',
    linkedin: 'https://linkedin.com/company/afane',
  },
  links: {
    github: 'https://github.com/landourenech/afane',
  },
} as const;

export type SiteConfig = typeof siteConfig;
