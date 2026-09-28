export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type DeliveryOption = 'pickup' | 'standard' | 'express';
export type PaymentMethod = 'mobile_money' | 'card' | 'cash_on_delivery';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  seller_id: string | null;
  title: string;
  image_url: string | null;
  price_per_unit: number;
  unit: string;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_cost: number;
  service_fee: number;
  discount: number;
  total: number;
  currency: string;
  delivery_option: DeliveryOption;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_region: string | null;
  delivery_phone: string;
  delivery_notes: string | null;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  items?: OrderItem[];
}

export interface CreateOrderItemInput {
  productId: string;
  title: string;
  image_url: string;
  price_per_kg: number;
  unit: string;
  quantity: number;
  sellerId: string;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  delivery: {
    option: DeliveryOption;
    address?: string;
    city?: string;
    region?: string;
    phone: string;
    notes?: string;
  };
  payment: {
    method: PaymentMethod;
    phone?: string;
  };
  summary: {
    subtotal: number;
    deliveryCost: number;
    serviceFee: number;
    discount: number;
    total: number;
  };
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipped:   'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded:  'Remboursée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: 'bg-yellow-100',  text: 'text-yellow-700' },
  confirmed: { bg: 'bg-blue-100',    text: 'text-blue-700' },
  preparing: { bg: 'bg-orange-100',  text: 'text-orange-700' },
  shipped:   { bg: 'bg-purple-100',  text: 'text-purple-700' },
  delivered: { bg: 'bg-green-100',   text: 'text-green-700' },
  cancelled: { bg: 'bg-red-100',     text: 'text-red-700' },
  refunded:  { bg: 'bg-gray-100',    text: 'text-gray-700' },
};

export const CANCELLABLE_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
];

export const DELIVERY_LABELS: Record<DeliveryOption, string> = {
  pickup:   'Retrait sur place',
  standard: 'Livraison standard',
  express:  'Livraison express',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  mobile_money:     'Mobile Money',
  card:             'Carte bancaire',
  cash_on_delivery: 'Paiement à la livraison',
};
