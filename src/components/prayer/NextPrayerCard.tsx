"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

export type PrayerPoint = { key: string; label: string; timeMinutes: number };

export type NextPrayerCardProps = {
  now: Date;
  lastPrayer: PrayerPoint;
  nextPrayer: PrayerPoint;
  etaLabel: string; // e.g. "1 h 04" or "42 min"
  nextTimeLabel: string; // e.g. "13:50"
  tMinusMinutes?: number; // minutes before next (for T-10 / T-0 states)
  prefersReducedMotion?: boolean;
};

export default function NextPrayerCard({
  now,
  lastPrayer,
  nextPrayer,
  etaLabel,
  nextTimeLabel,
  tMinusMinutes = 9999,
  prefersReducedMotion = false,
}: NextPrayerCardProps) {
  function formatHijriFull(date: Date): string {
    try {
      return new Intl.DateTimeFormat("fr-FR-u-ca-islamic", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      // Si non supporté, ne rien afficher (évite le mélange avec la date grégorienne)
      return "";
    }
  }

  function getPrayerImage(key: string): string {
    switch (key) {
      case "Fajr":
        return "/prayers/sobh.png";      // Upload: SOBH
      case "Dhuhr":
        return "/prayers/dohr.png";      // Upload: DOHR
      case "Asr":
        return "/prayers/asr.png";       // Upload: ASR
      case "Maghrib":
        return "/prayers/maghrib.png";   // Upload: Maghrib
      case "Isha":
        return "/prayers/isha.png";      // Upload: ISHA
      default:
        return "/prayers/placeholder.png";
    }
  }
  // Compute segment progress (between last and next), as fraction [0..1]
  const { fraction } = useMemo(() => {
    const nowM = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const start = lastPrayer.timeMinutes;
    const end = Math.max(start + 1, nextPrayer.timeMinutes);
    const span = end - start;
    const clamped = Math.max(0, Math.min(span, nowM - start));
    return { fraction: clamped / span };
  }, [now, lastPrayer.timeMinutes, nextPrayer.timeMinutes]);

  // aria-live announcements around T-10 / T-0
  const ariaLiveMessage = tMinusMinutes === 10
    ? `Bientôt l'adhan pour ${nextPrayer.label} dans 10 minutes`
    : tMinusMinutes === 0
      ? `Adhan maintenant pour ${nextPrayer.label}`
      : "";

  const [imgSrc, setImgSrc] = useState<string>(getPrayerImage(lastPrayer.key));
  useEffect(() => {
    setImgSrc(getPrayerImage(lastPrayer.key));
  }, [lastPrayer.key]);

  const fullDateLabel = useMemo(() => formatHijriFull(now), [now]);

  return (
    <section aria-label="Prochaine prière" className="rounded-12 overflow-hidden">
      {/* Image plein cadre + overlay texte */}
      <div className="relative w-full h-[230px]">
        <Image src={imgSrc} alt={lastPrayer.label} fill sizes="100vw" className="object-cover" onError={() => setImgSrc("/hero-creteil-2.png")} />
        {/* Date en haut à droite */}
        {fullDateLabel ? (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/70 text-[12.5px] leading-none text-black rounded-full px-2.5 py-1 backdrop-blur-sm whitespace-nowrap">
              {fullDateLabel}
            </div>
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          <div className="relative p-3">
            <div className="text-white/95 text-[15px] md:text-[16px] font-[600] tracking-[-0.2px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              Prière actuelle : <span className="font-[700]">{lastPrayer.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Texte et barre sous la photo, sans encadré */}
      <div className="pt-3 pb-4 px-0">
        <div className="flex items-center gap-2 text-[13.75px] md:text-[14.25px] font-[500] tracking-[-0.2px] text-[var(--text)]" aria-label={`Prochaine ${nextPrayer.label} à ${nextTimeLabel} dans ${etaLabel}`}>
          <Clock size={16} className="text-[var(--text-muted)]" />
          <span><span className="font-[600]">{nextPrayer.label}</span> dans <span className="tabular-nums">{etaLabel}</span></span>
        </div>
        <div className="mt-3">
          <div className="relative h-[8px] rounded-full bg-neutral-200/60 dark:bg-white/10 overflow-hidden">
            <div
              className={prefersReducedMotion ? "h-full" : "h-full"}
              style={{
                width: `${Math.round(Math.max(0, Math.min(1, fraction)) * 100)}%`,
                backgroundColor: tMinusMinutes <= 10 ? "var(--neena-green-accent)" : "var(--neena-green)",
                transition: prefersReducedMotion ? undefined : "width 1000ms linear",
              }}
            />
          </div>
          {tMinusMinutes <= 10 && (
            <div className="mt-2 inline-flex items-center rounded-full border border-emerald-600/20 bg-emerald-600/10 px-2 py-[2px] text-[12px] text-emerald-700">Bientôt l’adhan</div>
          )}
        </div>
      </div>
      {ariaLiveMessage ? <div aria-live="polite" className="sr-only">{ariaLiveMessage}</div> : null}
    </section>
  );
}

