import { z } from 'zod';

export const notificationPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sounds: z.boolean(),
  messages: z.boolean(),
  orders: z.boolean(),
  marketing: z.boolean(),
});

export const privacyPreferencesSchema = z.object({
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showLocation: z.boolean(),
  allowMessages: z.enum(['everyone', 'contacts', 'nobody']),
});

export const chatPreferencesSchema = z.object({
  wallpaper: z.string(),
  fontSize: z.enum(['small', 'medium', 'large']),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  region: z.string(),
  notifications: notificationPreferencesSchema,
  privacy: privacyPreferencesSchema,
  chats: chatPreferencesSchema,
});
