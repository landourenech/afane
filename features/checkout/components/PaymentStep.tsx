'use client';

import { ArrowLeft, ArrowRight, Smartphone, CreditCard, Banknote, Shield } from 'lucide-react';
import { PAYMENT_METHODS, type PaymentInfo, type PaymentMethod } from '../types';

interface PaymentStepProps {
  payment: PaymentInfo;
  onUpdate: (patch: Partial<PaymentInfo>) => void;
  onSelectMethod: (method: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
  canContinue: boolean;
}

const METHOD_ICONS = {
  mobile_money: Smartphone,
  card: CreditCard,
  cash_on_delivery: Banknote,
};

export function PaymentStep({
  payment,
  onUpdate,
  onSelectMethod,
  onNext,
  onBack,
  canContinue,
}: PaymentStepProps) {
  return (
    <div className="space-y-5">
      {/* Méthodes */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
          Méthode de paiement
        </h3>
        <div className="space-y-2">
          {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => {
            const info = PAYMENT_METHODS[method];
            const Icon = METHOD_ICONS[method];
            const isActive = payment.method === method;
            return (
              <button
                key={method}
                onClick={() => onSelectMethod(method)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  isActive
                    ? 'border-[var(--afane-orange)] bg-[var(--afane-orange)]/5'
                    : 'border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--afane-orange)]/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-[var(--afane-orange)]/15' : 'bg-[var(--bg-tertiary)]'}`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[var(--afane-orange)]' : 'text-[var(--text-secondary)]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${isActive ? 'text-[var(--afane-orange)]' : 'text-[var(--text-primary)]'}`}>
                    {info.label}
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    {info.description}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-[var(--afane-orange)]' : 'border-[var(--border-secondary)]'}`}>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[var(--afane-orange)]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulaire Mobile Money */}
      {payment.method === 'mobile_money' && (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4">
          <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
            Numéro Mobile Money
          </label>
          <input
            type="tel"
            value={payment.phone || ''}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="+241 06 XX XX XX"
            className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
          />
          <p className="text-[11px] text-[var(--text-tertiary)] mt-2">
            Vous recevrez une notification pour valider le paiement.
          </p>
        </div>
      )}

      {/* Formulaire Carte */}
      {payment.method === 'card' && (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
              Numéro de carte
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={payment.cardNumber || ''}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                const formatted = v.replace(/(.{4})/g, '$1 ').trim();
                onUpdate({ cardNumber: formatted });
              }}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
              Nom du titulaire
            </label>
            <input
              type="text"
              value={payment.cardName || ''}
              onChange={(e) => onUpdate({ cardName: e.target.value })}
              placeholder="Nom sur la carte"
              className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Expiration
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={payment.cardExpiry || ''}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                  onUpdate({ cardExpiry: v });
                }}
                placeholder="MM/AA"
                className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                CVV
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={payment.cardCvv || ''}
                onChange={(e) => onUpdate({ cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="123"
                className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Info paiement à la livraison */}
      {payment.method === 'cash_on_delivery' && (
        <div className="bg-[var(--afane-green)]/5 rounded-2xl border border-[var(--afane-green)]/20 p-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Vous paierez en espèces au moment de la réception de votre commande.
            Merci de préparer le montant exact.
          </p>
        </div>
      )}

      {/* Sécurité */}
      <div className="flex items-start gap-2 p-3 bg-[var(--afane-green)]/5 rounded-xl">
        <Shield className="h-4 w-4 text-[var(--afane-green)] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          Vos informations de paiement sont sécurisées et chiffrées. AFANE ne stocke jamais vos données bancaires.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="h-12 px-5 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-semibold rounded-full hover:bg-[var(--border-secondary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--afane-green)] text-white text-sm font-bold rounded-full hover:bg-[var(--afane-orange)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Confirmer la commande
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
