import { z } from 'zod';

export const createOrderSchema = z.object({
  seller_id: z.string().uuid('Vendeur invalide'),
  publication_id: z.string().uuid().optional(),
  quantity: z.number().positive('La quantité doit être positive'),
  unit_price: z.number().positive('Le prix doit être positif'),
  total_amount: z.number().positive('Le montant doit être positif'),
  notes: z.string().max(500).optional(),
  delivery_address: z.string().max(200).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
