"use client";

export function ProgressHeader({ current, total }: { current: number; total: number }) {
  const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
  return (
    <div className="w-full h-8 flex items-center justify-center" aria-label={`Step ${current} of ${total}`}>
      <div className="text-[13px] font-[700] text-[var(--text)]" style={{ letterSpacing: -0.2 }}>{current}/{total}</div>
      <div className="ml-2 h-[6px] flex-1 max-w-[120px] bg-[var(--surface-2)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-[var(--brand)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

