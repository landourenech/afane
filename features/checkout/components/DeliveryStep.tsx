'use client';

import { ArrowLeft, ArrowRight, MapPin, Phone, Home } from 'lucide-react';
import { DELIVERY_OPTIONS, type DeliveryInfo, type DeliveryOption } from '../types';

interface DeliveryStepProps {
  delivery: DeliveryInfo;
  onUpdate: (patch: Partial<DeliveryInfo>) => void;
  onSelectOption: (option: DeliveryOption) => void;
  onNext: () => void;
  onBack: () => void;
  canContinue: boolean;
}

export function DeliveryStep({
  delivery,
  onUpdate,
  onSelectOption,
  onNext,
  onBack,
  canContinue,
}: DeliveryStepProps) {
  const isPickup = delivery.option === 'pickup';

  return (
    <div className="space-y-5">
      {/* Options de livraison */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
          Mode de livraison
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(DELIVERY_OPTIONS) as DeliveryOption[]).map((opt) => {
            const info = DELIVERY_OPTIONS[opt];
            const isActive = delivery.option === opt;
            return (
              <button
                key={opt}
                onClick={() => onSelectOption(opt)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-[var(--afane-orange)] bg-[var(--afane-orange)]/5'
                    : 'border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--afane-orange)]/50'
                }`}
              >
                <p className={`text-sm font-bold ${isActive ? 'text-[var(--afane-orange)]' : 'text-[var(--text-primary)]'}`}>
                  {info.label}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                  {info.description}
                </p>
                <p className={`text-xs font-bold mt-1.5 ${isActive ? 'text-[var(--afane-orange)]' : 'text-[var(--afane-green)]'}`}>
                  {info.cost === 0 ? 'Gratuit' : `${info.cost.toLocaleString('fr-FR')} F`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Adresse (si pas pickup) */}
      {!isPickup && (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4 space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--afane-orange)]" />
            Adresse de livraison
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
              Adresse complète
            </label>
            <textarea
              value={delivery.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Quartier, rue, numéro..."
              rows={2}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Ville
              </label>
              <input
                type="text"
                value={delivery.city}
                onChange={(e) => onUpdate({ city: e.target.value })}
                placeholder="Libreville"
                className="w-full px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Région
              </label>
              <input
                type="text"
                value={delivery.region}
                onChange={(e) => onUpdate({ region: e.target.value })}
                placeholder="Estuaire"
                className="w-full px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Téléphone */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Phone className="h-4 w-4 text-[var(--afane-orange)]" />
          Contact
        </h3>
        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            value={delivery.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="+241 06 XX XX XX"
            className="w-full px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
          />
        </div>
      </div>

      {/* Pickup : infos vendeur */}
      {isPickup && (
        <div className="bg-[var(--afane-green)]/5 rounded-2xl border border-[var(--afane-green)]/20 p-4">
          <h3 className="text-sm font-bold text-[var(--afane-green)] mb-1 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retrait sur place
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Vous récupérerez vos produits directement chez le vendeur. Les coordonnées exactes vous seront envoyées après confirmation.
          </p>
        </div>
      )}

      {/* Notes */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] p-4">
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
          Notes pour le livreur (optionnel)
        </label>
        <textarea
          value={delivery.notes || ''}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Instructions particulières..."
          rows={2}
          className="w-full px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30 resize-none"
        />
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
          Continuer vers le paiement
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
