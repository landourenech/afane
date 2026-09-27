'use client';

import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
}

export function Checkbox({ checked, onChange, label, count }: CheckboxProps) {
  return (
    <label className="group flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
      {/* Case */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`flex-shrink-0 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all duration-150 ${
          checked
            ? 'bg-[var(--afane-green)] border-[var(--afane-green)]'
            : 'bg-transparent border-[var(--border-secondary)] group-hover:border-[var(--afane-orange)]'
        }`}
        aria-checked={checked}
        role="checkbox"
      >
        {checked && (
          <Check
            className="w-3 h-3 text-white"
            strokeWidth={3.5}
          />
        )}
      </button>

      {/* Label */}
      <span
        className={`flex-1 text-sm transition-colors ${
          checked
            ? 'text-[var(--afane-green)] font-semibold'
            : 'text-[var(--text-secondary)] group-hover:text-[var(--afane-orange)]'
        }`}
      >
        {label}
      </span>

      {/* Count */}
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">
          {count}
        </span>
      )}
    </label>
  );
}
