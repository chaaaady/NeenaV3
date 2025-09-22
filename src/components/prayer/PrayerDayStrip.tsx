"use client";

import React, { useMemo } from "react";

export type StripPoint = { key: string; label: string; timeMinutes: number };

export type PrayerDayStripProps = {
  now: Date;
  points: StripPoint[];
  onTickTap?: (point: StripPoint) => void;
  prefersReducedMotion?: boolean;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toHHMM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export default function PrayerDayStrip({
  now,
  points,
  onTickTap,
  prefersReducedMotion = false,
}: PrayerDayStripProps) {
  const { ordered, endMin, fraction, nextPoint, firstMin, lastMin } = useMemo(() => {
    const ordered = (points || [])
      .filter((p) => p && Number.isFinite(p.timeMinutes))
      .slice()
      .sort((a, b) => a.timeMinutes - b.timeMinutes);

    const firstMin = ordered.length ? ordered[0].timeMinutes : 0;
    const lastMin = ordered.length ? ordered[ordered.length - 1].timeMinutes : 1;

    // Use seconds precision for smoother progress, but minutes domain for bounds
    const nowMinutesPrecise = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    let previous = ordered[0];
    let next = ordered[ordered.length - 1];
    for (let i = 0; i < ordered.length; i++) {
      if (ordered[i].timeMinutes <= nowMinutesPrecise) previous = ordered[i];
      if (ordered[i].timeMinutes > nowMinutesPrecise) { next = ordered[i]; break; }
    }

    const startMin = previous ? previous.timeMinutes : firstMin;
    const endMinRaw = next ? next.timeMinutes : lastMin;
    const endMin = endMinRaw > startMin ? endMinRaw : startMin + 1; // avoid div/0

    const total = Math.max(1, endMin - startMin);
    const elapsed = clamp(nowMinutesPrecise - startMin, 0, total);
    const fraction = clamp(elapsed / total, 0, 1);

    return { ordered, endMin, fraction, nextPoint: next, firstMin, lastMin };
  }, [now, points]);

  if (!ordered.length) {
    return (
      <div className="w-full rounded-12 border border-[var(--border)] p-3 bg-white text-[14px] text-[var(--text-muted)]">
        Aucune donnée de prière.
      </div>
    );
  }

  const domain = Math.max(1, lastMin - firstMin);

  const progressStyle: React.CSSProperties = {
    width: `${fraction * 100}%`,
    transition: prefersReducedMotion ? "none" : "width 600ms ease-out",
  };

  const markerToLeft = (m: number) => `${clamp((m - firstMin) / domain, 0, 1) * 100}%`;

  return (
    <div className="w-full rounded-12 border border-[var(--border)] p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[14px] font-medium text-[var(--text-strong)]">Progression de la journée</div>
        {nextPoint ? (
          <div className="text-[12px] text-[var(--text-muted)]">
            Prochaine: <span className="font-medium">{nextPoint.label}</span> à {toHHMM(endMin)}
          </div>
        ) : null}
      </div>

      <div className="relative h-2 w-full rounded-full bg-[rgba(0,0,0,0.08)] overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-[#0E3B2E]" style={progressStyle} />

        {ordered.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-label={`${p.label} à ${toHHMM(p.timeMinutes)}`}
            onClick={onTickTap ? () => onTickTap(p) : undefined}
            className="absolute -top-1.5 h-5 w-3 -translate-x-1/2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]"
            style={{ left: markerToLeft(p.timeMinutes) }}
          >
            <span className="block h-2 w-[2px] mx-auto bg-[rgba(0,0,0,0.5)]" />
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-5 text-[11px] text-[var(--text-muted)]">
        {ordered.map((p) => (
          <div key={`${p.key}-label`} className="text-center">
            <div className="font-medium text-[var(--text-strong)]">{p.label}</div>
            <div>{toHHMM(p.timeMinutes)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

