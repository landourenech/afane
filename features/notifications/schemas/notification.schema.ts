import { z } from 'zod';

export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  type: z.enum([
    'publication_created',
    'publication_sold',
    'publication_expired',
    'publication_cancelled',
    'new_order',
    'order_confirmed',
    'order_shipped',
    'order_delivered',
    'new_message',
    'new_follower',
    'price_alert',
    'system',
  ]),
  title: z.string().min(1).max(200),
  content: z.string().max(1000).optional(),
  link: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
