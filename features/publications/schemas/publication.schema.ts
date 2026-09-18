import { z } from 'zod';

export const createPublicationSchema = z.object({
  title: z.string().min(3, 'Titre trop court').max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive('Le prix doit être positif'),
  quantity: z.number().positive().default(1),
  unit: z.string().default('unité'),
  main_category: z.string().min(1),
  sale_type: z.enum(['individual', 'group']).default('individual'),
  images: z.array(z.string().url()).min(1, 'Au moins une image'),
});

export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;