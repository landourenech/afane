'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface SettingsHeaderProps {
  title: string;
  showBack?: boolean;
}

export function SettingsHeader({ title, showBack = true }: SettingsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-6">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
        </button>
      )}
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{title}</h1>
    </div>
  );
}
