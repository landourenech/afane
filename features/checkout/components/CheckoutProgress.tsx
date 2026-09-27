'use client';

import { Check } from 'lucide-react';
import { PROGRESS_STEPS, STEP_LABELS, type CheckoutStep } from '../types';

interface CheckoutProgressProps {
  current: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

export function CheckoutProgress({ current, onStepClick }: CheckoutProgressProps) {
  const currentIndex = PROGRESS_STEPS.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-0 px-4 py-6">
      {PROGRESS_STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;
        const isLast = idx === PROGRESS_STEPS.length - 1;

        return (
          <div key={step} className="flex items-center flex-1 max-w-[180px]">
            {/* Cercle */}
            <button
              onClick={() => onStepClick && idx <= currentIndex && onStepClick(step)}
              disabled={idx > currentIndex}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isCompleted
                  ? 'bg-[var(--afane-green)] text-white'
                  : isActive
                  ? 'bg-[var(--afane-orange)] text-white ring-4 ring-[var(--afane-orange)]/20'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
              } ${idx <= currentIndex ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
              aria-label={STEP_LABELS[step]}
            >
              {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : idx + 1}
            </button>

            {/* Label */}
            <div className="ml-2 flex-1 min-w-0 hidden sm:block">
              <p
                className={`text-[11px] font-semibold truncate transition-colors ${
                  isActive
                    ? 'text-[var(--afane-orange)]'
                    : isCompleted
                    ? 'text-[var(--afane-green)]'
                    : 'text-[var(--text-tertiary)]'
                }`}
              >
                {STEP_LABELS[step]}
              </p>
            </div>

            {/* Ligne de connexion */}
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  isCompleted ? 'bg-[var(--afane-green)]' : 'bg-[var(--border-primary)]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
