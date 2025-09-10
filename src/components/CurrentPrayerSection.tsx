"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTick } from "@/hooks/useTick";

type PrayerKey = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type PrayerValue = { adhan?: string; iqama?: string; wait_minutes?: number | string } | null | undefined;
type Timings = Partial<Record<PrayerKey | "Sunrise" | "Jumua", PrayerValue>>;

function toMinutes(time: string): number {
  const [h, m] = (time || "").split(":").map((x) => parseInt(x || "0", 10));
  return Math.max(0, (h || 0) * 60 + (m || 0));
}

function selectTime(p: PrayerValue): string {
  if (!p) return "";
  if (typeof (p as any) === "string") return String(p);
  const v = p as { adhan?: string; iqama?: string };
  return (v.adhan && v.adhan.trim()) || (v.iqama && v.iqama.trim()) || "";
}

type Props = { slug?: string; url?: string; embedded?: boolean };

export default function CurrentPrayerSection({ slug, url, embedded }: Props) {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const now = useTick(30000);
  

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const qs = new URLSearchParams();
        if (slug) qs.set("slug", slug);
        if (url) qs.set("url", url);
        qs.set("t", Date.now().toString());
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json: { ok: boolean; timings?: Timings; error?: string } = await res.json();
        if (!json.ok || !json.timings) throw new Error(json.error || "API error");
        if (!cancelled) setTimings(json.timings);
      } catch (_e) {
        if (!cancelled) setError("Impossible de charger les horaires");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, url]);

  const data = useMemo(() => {
    if (!timings) return null;
    const order: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const points = order
      .map((k) => ({ key: k, at: selectTime(timings[k]), min: toMinutes(selectTime(timings[k])) }))
      .filter((x) => x.at);
    if (!points.length) return null;
    const nowM = now.getHours() * 60 + now.getMinutes();
    let prev = points[0];
    let next = points[points.length - 1];
    for (let i = 0; i < points.length; i++) {
      if (points[i].min <= nowM) prev = points[i];
      if (points[i].min > nowM) { next = points[i]; break; }
    }
    // if now after last prayer, keep next as last to avoid crash; fraction clamps to 1
    const start = prev.min;
    const end = next.min > start ? next.min : start + 1; // avoid zero division
    const total = Math.max(1, end - start);
    const elapsed = Math.max(0, Math.min(total, nowM - start));
    const fraction = elapsed / total;
    const minutesLeft = Math.max(0, Math.ceil((end - nowM)));
    return {
      currentName: prev.key,
      nextName: next.key,
      startMin: start,
      endMin: end,
      startHH: String(Math.floor(start / 60)).padStart(2, "0"),
      startMM: String(start % 60).padStart(2, "0"),
      endHH: String(Math.floor(end / 60)).padStart(2, "0"),
      endMM: String(end % 60).padStart(2, "0"),
      fraction,
      minutesLeft,
    };
  }, [timings, now]);

  if (loading) {
    return (
      <div className="rounded-12 border border-[var(--border)] p-4 bg-white">
        <div className="h-5 w-40 bg-[var(--skeleton)] rounded" />
        <div className="mt-2 h-3 w-full bg-[var(--skeleton)] rounded" />
      </div>
    );
  }
  if (error) return <div className="text-[14px] text-red-600">{error}</div>;
  if (!data) return <div className="text-[14px] text-[var(--text-muted)]">Aucune donnée disponible.</div>;

  const percent = Math.round(data.fraction * 100);
  const hLeft = Math.floor(data.minutesLeft / 60);
  const mLeft = data.minutesLeft % 60;
  const displayLeft = hLeft ? `${hLeft} h ${mLeft} min` : `${mLeft} min`;

  // Smooth color between green → amber → red based on fraction
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const lerpColor = (c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] => [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
  const GREEN: [number, number, number] = [34, 197, 94];   // tailwind green-500
  const AMBER: [number, number, number] = [245, 158, 11];  // amber-500
  const RED: [number, number, number] = [239, 68, 68];     // red-500
  let rgb: [number, number, number];
  if (data.fraction < 1 / 3) {
    const t = data.fraction / (1 / 3);
    rgb = lerpColor(GREEN, AMBER, Math.max(0, Math.min(1, t)));
  } else if (data.fraction < 2 / 3) {
    const t = (data.fraction - 1 / 3) / (1 / 3);
    rgb = lerpColor(AMBER, RED, Math.max(0, Math.min(1, t)));
  } else {
    rgb = RED;
  }
  const fillColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`; // calm opacity

  return (
    <section aria-label="Prière actuelle" className="space-y-3">
      <div className={embedded ? "p-0" : "rounded-12 border border-[var(--border)] p-5 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)]"}>

        {/* Header: current date/time shifted to time card above; keep countdown only */}
        <div className="mt-1 flex items-center justify-center">
          <div
            className="text-[28px] font-[900] leading-none text-[var(--text)]"
            role="timer"
            aria-live="polite"
            aria-label={`${displayLeft} restant avant la prière de ${data.nextName}`}
          >
            {displayLeft}
          </div>
        </div>
        <div className="mt-2 text-center text-[14px] font-[800] text-[var(--text)]">
          {displayLeft} restant avant la prière de {data.nextName}
        </div>

        {/* Timeline with base segments + smooth color fill */}
        <div className="mt-4 relative h-3 rounded-full overflow-hidden bg-gray-200">
          {/* Base thirds colors (soft) */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-green-500/20" />
          <div className="absolute inset-y-0 left-1/3 w-1/3 bg-amber-500/20" />
          <div className="absolute inset-y-0 left-2/3 w-1/3 bg-red-500/20" />
          {/* Smooth fill overlay */}
          <div className="absolute inset-y-0 left-0 transition-[width,background-color] duration-500" style={{ width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: fillColor }} />
          {/* Subtle separators for thirds */}
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/50" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/50" />
          {/* Progress cursor (neutral) */}
          <div className="absolute -top-[3px] w-2 h-2 rounded-full bg-[var(--text)] shadow-sm transition-[left] duration-500"
               style={{ left: `${Math.max(0, Math.min(100, percent))}%`, transform: "translateX(-50%)" }}
               aria-hidden="true" />
        </div>

        <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--text-muted)]">
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[14px] text-[var(--text)] font-[700]">{data.currentName}</span>
            <span>{data.startHH}:{data.startMM}</span>
          </span>
          <span className="flex flex-col items-end leading-tight">
            <span className="text-[14px] text-[var(--text)] font-[700]">{data.nextName}</span>
            <span>{data.endHH}:{data.endMM}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

