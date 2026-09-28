'use client';

import { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/features/orders';
import {
  DELIVERY_OPTIONS,
  SERVICE_FEE,
  PROGRESS_STEPS,
  type CheckoutStep,
  type DeliveryInfo,
  type PaymentInfo,
  type DeliveryOption,
  type PaymentMethod,
} from '../types';

export function useCheckout() {
  const { items, subtotal, clearCart } = useCart();
  const { profile } = useAuth();   /* ✅ DANS le hook */

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    option: 'standard',
    address: '',
    city: '',
    region: '',
    phone: '',
    notes: '',
    cost: DELIVERY_OPTIONS.standard.cost,
  });
  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'mobile_money',
  });
  const [discount] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const deliveryCost = delivery.option === 'pickup' ? 0 : delivery.cost;
    const total = subtotal + deliveryCost + SERVICE_FEE - discount;
    return {
      subtotal,
      deliveryCost,
      serviceFee: SERVICE_FEE,
      discount,
      total: Math.max(0, total),
    };
  }, [subtotal, delivery, discount]);

  const stepIndex = PROGRESS_STEPS.indexOf(step);

  const next = () => {
    const i = PROGRESS_STEPS.indexOf(step);
    if (i < PROGRESS_STEPS.length - 1) {
      setStep(PROGRESS_STEPS[i + 1]);
    }
  };

  const back = () => {
    const i = PROGRESS_STEPS.indexOf(step);
    if (i > 0) {
      setStep(PROGRESS_STEPS[i - 1]);
    }
  };

  const setDeliveryOption = (option: DeliveryOption) => {
    setDelivery((d) => ({
      ...d,
      option,
      cost: DELIVERY_OPTIONS[option].cost,
    }));
  };

  const updateDelivery = (patch: Partial<DeliveryInfo>) => {
    setDelivery((d) => ({ ...d, ...patch }));
  };

  const updatePayment = (patch: Partial<PaymentInfo>) => {
    setPayment((p) => ({ ...p, ...patch }));
  };

  const canContinue = useMemo(() => {
    switch (step) {
      case 'cart':
        return items.length > 0;
      case 'delivery':
        if (delivery.option === 'pickup') {
          return delivery.phone.length >= 8;
        }
        return (
          delivery.address.trim().length >= 5 &&
          delivery.city.trim().length >= 2 &&
          delivery.region.trim().length >= 2 &&
          delivery.phone.length >= 8
        );
      case 'payment':
        if (payment.method === 'mobile_money') {
          return (payment.phone || '').length >= 8;
        }
        if (payment.method === 'card') {
          return (
            (payment.cardNumber || '').replace(/\s/g, '').length === 16 &&
            (payment.cardName || '').length >= 3 &&
            (payment.cardExpiry || '').length === 5 &&
            (payment.cardCvv || '').length >= 3
          );
        }
        return true;
      default:
        return true;
    }
  }, [step, items, delivery, payment]);

  const submitOrder = async () => {
    if (!profile?.id) throw new Error('Non authentifié');

    try {
      const order = await orderService.create(
        {
          items: items.map((item) => ({
            productId: item.productId,
            title: item.title,
            image_url: item.image_url,
            price_per_kg: item.price_per_kg,
            unit: item.unit,
            quantity: item.quantity,
            sellerId: item.sellerId,
          })),
          delivery: {
            option: delivery.option,
            address: delivery.address,
            city: delivery.city,
            region: delivery.region,
            phone: delivery.phone,
            notes: delivery.notes,
          },
          payment: {
            method: payment.method,
            phone: payment.phone,
          },
          summary: {
            subtotal: summary.subtotal,
            deliveryCost: summary.deliveryCost,
            serviceFee: summary.serviceFee,
            discount: summary.discount,
            total: summary.total,
          },
        },
        profile.id
      );

      setOrderId(order.order_number);
      clearCart();
      setStep('confirmation');
      return order.order_number;
    } catch (error: any) {
      console.error('Erreur commande:', error);
      throw error;
    }
  };

  return {
    step,
    stepIndex,
    items,
    delivery,
    payment,
    summary,
    orderId,
    canContinue,
    next,
    back,
    setStep,
    setDeliveryOption,
    updateDelivery,
    updatePayment,
    submitOrder,
  };
}
