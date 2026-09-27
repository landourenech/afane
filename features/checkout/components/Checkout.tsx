'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../hooks/use-checkout';
import { CheckoutProgress } from './CheckoutProgress';
import { CartStep } from './CartStep';
import { DeliveryStep } from './DeliveryStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmationStep } from './ConfirmationStep';
import { OrderSummary } from './OrderSummary';
import { PROGRESS_STEPS } from '../types';

export function Checkout() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const { items, updateQuantity, removeItem } = useCart();
  const {
    step,
    stepIndex,
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
  } = useCheckout();

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const isConfirmation = step === 'confirmation';

  /* Étape paiement → soumettre à la place de "next" */
  const handlePaymentNext = async () => {
    await submitOrder();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      {/* Bouton retour global */}
      {!isConfirmation && stepIndex > 0 && (
        <button
          onClick={back}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--afane-orange)] transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      )}

      {/* Titre */}
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--afane-green)] mb-1">
        {isConfirmation ? 'Commande confirmée' : 'Finaliser la commande'}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {isConfirmation
          ? 'Votre commande a bien été enregistrée'
          : 'Vérifiez votre panier et finalisez votre achat'}
      </p>

      {/* Progress */}
      {!isConfirmation && (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] mb-6 overflow-x-auto">
          <CheckoutProgress current={step} onStepClick={setStep} />
        </div>
      )}

      {/* Contenu */}
      {isConfirmation ? (
        <ConfirmationStep
          orderId={orderId!}
          delivery={delivery}
          summary={summary}
          username={username}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Colonne principale */}
          <div className="min-w-0">
            {step === 'cart' && (
              <CartStep
                items={items}
                username={username}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onNext={next}
                canContinue={canContinue}
              />
            )}

            {step === 'delivery' && (
              <DeliveryStep
                delivery={delivery}
                onUpdate={updateDelivery}
                onSelectOption={setDeliveryOption}
                onNext={next}
                onBack={back}
                canContinue={canContinue}
              />
            )}

            {step === 'payment' && (
              <PaymentStep
                payment={payment}
                onUpdate={updatePayment}
                onSelectMethod={(m) => updatePayment({ method: m })}
                onNext={handlePaymentNext}
                onBack={back}
                canContinue={canContinue}
              />
            )}
          </div>

          {/* Colonne récap */}
          <div className="lg:block">
            <OrderSummary summary={summary} itemCount={itemCount} />
          </div>
        </div>
      )}
    </div>
  );
}
