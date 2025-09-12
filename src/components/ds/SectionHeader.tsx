"use client";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="app-title">{title}</div>
      {subtitle ? (
        <div className="text-fine">{subtitle}</div>
      ) : null}
    </div>
  );
}

