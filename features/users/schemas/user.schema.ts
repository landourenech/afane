import { z } from 'zod';

export const updateProfileSchema = z.object({
  display_name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
  region: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
  address: z.string().max(200).optional(),
  preferred_language: z.string().default('fr'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
