export type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

export type DeliveryOption = 'pickup' | 'standard' | 'express';
export type PaymentMethod = 'mobile_money' | 'card' | 'cash_on_delivery';

export interface CartItem {
  productId: string;
  title: string;
  image_url: string;
  price_per_kg: number;
  unit: string;
  quantity: number;
  sellerId: string;
  sellerName: string;
  maxQuantity: number;
}

export interface DeliveryInfo {
  option: DeliveryOption;
  address: string;
  city: string;
  region: string;
  phone: string;
  notes?: string;
  cost: number;
}

export interface PaymentInfo {
  method: PaymentMethod;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export interface OrderSummary {
  subtotal: number;
  deliveryCost: number;
  serviceFee: number;
  discount: number;
  total: number;
}

export const DELIVERY_OPTIONS: Record<DeliveryOption, { label: string; description: string; cost: number; eta: string }> = {
  pickup:   { label: 'Retrait sur place', description: 'Chez le vendeur', cost: 0, eta: 'Aujourd\'hui' },
  standard: { label: 'Livraison standard', description: '2-3 jours ouvrés', cost: 1500, eta: '2-3 jours' },
  express:  { label: 'Livraison express', description: 'Sous 24h', cost: 3500, eta: '24h' },
};

export const PAYMENT_METHODS: Record<PaymentMethod, { label: string; description: string }> = {
  mobile_money:     { label: 'Mobile Money', description: 'Airtel, Moov, MTN' },
  card:             { label: 'Carte bancaire', description: 'Visa, Mastercard' },
  cash_on_delivery: { label: 'Paiement à la livraison', description: 'En espèces' },
};

export const SERVICE_FEE = 500;      /* Frais de service fixes */
export const PROGRESS_STEPS: CheckoutStep[] = ['cart', 'delivery', 'payment', 'confirmation'];

export const STEP_LABELS: Record<CheckoutStep, string> = {
  cart:         'Panier',
  delivery:     'Livraison',
  payment:      'Paiement',
  confirmation: 'Confirmation',
};
