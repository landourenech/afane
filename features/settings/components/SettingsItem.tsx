'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { SettingsItemConfig } from '../types';

export function SettingsItem({
  icon: Icon,
  label,
  description,
  href,
  onClick,
  badge,
  variant = 'default',
  iconBg,
}: SettingsItemConfig) {
  const isDanger = variant === 'danger';

  const content = (
    <>
      <div
        className={`p-2 rounded-xl flex-shrink-0 ${
          iconBg || (isDanger ? 'bg-red-100' : 'bg-[var(--afane-orange)]/10')
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            isDanger ? 'text-red-600' : 'text-[var(--afane-orange)]'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p
          className={`font-medium text-sm truncate ${
            isDanger ? 'text-red-600' : 'text-[var(--text-primary)]'
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>

      {badge !== undefined && (
        <span className="flex-shrink-0 min-w-5 h-5 px-1.5 bg-[var(--afane-orange)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}

      <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)] flex-shrink-0" />
    </>
  );

  const className =
    'flex items-center gap-3 px-4 py-3.5 w-full transition-colors hover:bg-[var(--bg-hover)] active:bg-[var(--bg-tertiary)]';

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
