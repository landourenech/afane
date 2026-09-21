import { z } from 'zod';

export const createPublicationSchema = z.object({
  title: z.string().min(3, 'Titre trop court').max(100),
  description: z.string().max(1000).optional(),
  images: z.array(z.string()).min(1, 'Au moins une image'),
  price: z.number().positive('Le prix doit être positif'),
  quantity: z.number().positive('La quantité doit être positive'),
  unit: z.string().default('unité'),
  main_category: z.string().min(1, 'Catégorie requise'),
  sale_type: z.enum(['individual', 'group']).default('individual'),
  location: z.string().optional(),
  duration_days: z.number().int().positive().default(7),
});

export const updatePublicationSchema = createPublicationSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>;
