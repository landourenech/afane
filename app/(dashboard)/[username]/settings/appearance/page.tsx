'use client';

import { SettingsHeader } from '@/features/settings';

export default function AppearancePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <SettingsHeader title="Appearance" />
      <div className="bg-[var(--bg-primary)] rounded-2xl p-8 text-center">
        <p className="text-sm text-[var(--text-secondary)]">À venir</p>
      </div>
    </div>
  );
}
