"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTick } from "@/hooks/useTick";
import { NextPrayerCard } from "@/components/prayer";

type PrayerKey = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type PrayerValue = { adhan?: string; iqama?: string; wait_minutes?: number | string } | null | undefined;
type Timings = Partial<Record<PrayerKey | "Sunrise" | "Jumua", PrayerValue>>;

function toMinutes(time: string): number {
  const [h, m] = (time || "").split(":").map((x) => parseInt(x || "0", 10));
  return Math.max(0, (h || 0) * 60 + (m || 0));
}

function selectTime(p: PrayerValue): string {
  if (!p) return "";
  if (typeof p === "string") return String(p);
  const v = p as { adhan?: string; iqama?: string };
  return (v.adhan && v.adhan.trim()) || (v.iqama && v.iqama.trim()) || "";
}

type Props = { slug?: string; url?: string; embedded?: boolean };

export default function CurrentPrayerSection({ slug, url, embedded: _embedded }: Props) {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Tick every 1s to ensure smooth progress animation
  const now = useTick(1000);
  

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
      } catch {
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
    // Compute time in minutes with second precision for smooth progress
    const nowM = now.getHours() * 60 + now.getMinutes();
    const nowPreciseM = nowM + now.getSeconds() / 60;
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
    const elapsedPrecise = Math.max(0, Math.min(total, nowPreciseM - start));
    const fraction = elapsedPrecise / total;
    // minutes left rounded up, computed with seconds precision
    const minutesLeft = Math.max(0, Math.ceil((end * 60 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())) / 60));
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

  // Accessibility and carousel hooks must be declared before any early return
  // Reduced motion preference
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(!!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Legacy carousel hooks removed (replaced by DayStrip/optional Carousel component)

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

  
  const hLeft = Math.floor(data.minutesLeft / 60);
  const mLeft = data.minutesLeft % 60;
  const displayLeft = hLeft > 0 ? `${hLeft}h et ${mLeft} min` : `${mLeft} min`;

  // Day-long circular progress: start at Fajr, end at Isha
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();


  // aria-live announcement around T-10 / T-0
  const tMinusMin = Math.max(0, Math.ceil((data.endMin * 60 - nowSeconds) / 60));
  const ariaLiveMessage = tMinusMin === 10
    ? `Bientôt l'adhan pour ${data.nextName} dans 10 minutes`
    : tMinusMin === 0
      ? `C'est l'adhan pour ${data.nextName}`
      : "";

  // Compose new components
  const lastPrayer = { key: String(data.currentName), label: String(data.currentName), timeMinutes: data.startMin };
  const nextPrayer = { key: String(data.nextName), label: String(data.nextName), timeMinutes: data.endMin };

  return (
    <section aria-label="Zone prières" className="space-y-3">
      <NextPrayerCard
        now={now}
        lastPrayer={lastPrayer}
        nextPrayer={nextPrayer}
        etaLabel={displayLeft}
        nextTimeLabel={`${data.endHH}:${data.endMM}`}
        tMinusMinutes={tMinusMin}
        prefersReducedMotion={prefersReduced}
      />

      {ariaLiveMessage ? <div aria-live="polite" className="sr-only">{ariaLiveMessage}</div> : null}
    </section>
  );
}

