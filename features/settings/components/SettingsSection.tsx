'use client';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="mb-4">
      {title && (
        <h2 className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
          {title}
        </h2>
      )}
      <div className="bg-[var(--bg-primary)] rounded-2xl overflow-hidden divide-y divide-[var(--border-primary)]">
        {children}
      </div>
    </section>
  );
}
