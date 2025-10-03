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
  fractionOverride?: number;
  debug?: boolean;
};

export default function NextPrayerCard({
  now,
  lastPrayer,
  nextPrayer,
  etaLabel,
  nextTimeLabel,
  tMinusMinutes = 9999,
  prefersReducedMotion = false,
  fractionOverride,
  debug = false,
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

  // Mapping des images pour chaque prière avec des chemins distincts
  function getPrayerImage(key: string): string {
    const imageMap: Record<string, string> = {
      "Fajr": "/prayers/sobh.png",      // Aube - ciel bleu/violet
      "Dhuhr": "/prayers/dohr.png",     // Midi - soleil haut, lumière forte
      "Jumua": "/prayers/dohr.png",     // Vendredi midi - même image que Dhuhr
      "Asr": "/prayers/asr.png",        // Après-midi - lumière dorée
      "Maghrib": "/prayers/maghrib.png",// Coucher de soleil - orange/rouge
      "Isha": "/prayers/isha.png",      // Nuit - ciel sombre/étoiles
    };
    return imageMap[key] || "/prayers/placeholder.png";
  }
  
  // Compute elapsed/total and fraction (wrap across midnight if needed)
  const { elapsedMinutes, totalMinutes, fraction } = useMemo(() => {
    const nowPrecise = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const start = lastPrayer.timeMinutes;
    let end = nextPrayer.timeMinutes;
    if (end <= start) end += 1440; // next jour
    const total = Math.max(1, end - start);
    const elapsed = Math.max(0, Math.min(total, nowPrecise - start));
    return { elapsedMinutes: elapsed, totalMinutes: total, fraction: elapsed / total };
  }, [now, lastPrayer.timeMinutes, nextPrayer.timeMinutes]);
  const effectiveFraction = Math.max(0, Math.min(1, typeof fractionOverride === 'number' ? fractionOverride : fraction));
  const widthPctRaw = effectiveFraction * 100; // keep decimals for smooth motion

  // aria-live announcements around T-10 / T-0
  const ariaLiveMessage = tMinusMinutes === 10
    ? `Bientôt l'adhan pour ${nextPrayer.label} dans 10 minutes`
    : tMinusMinutes === 0
      ? `Adhan maintenant pour ${nextPrayer.label}`
      : "";

  // State pour l'image avec key pour forcer le refresh
  const [imgSrc, setImgSrc] = useState<string>(() => getPrayerImage(lastPrayer.key));
  const [imageKey, setImageKey] = useState<number>(0);
  
  useEffect(() => {
    const newSrc = getPrayerImage(lastPrayer.key);
    setImgSrc(newSrc);
    setImageKey(prev => prev + 1); // Force le rechargement de l'image
  }, [lastPrayer.key]);

  const fullDateLabel = useMemo(() => formatHijriFull(now), [now]);

  return (
    <section aria-label="Prière actuelle" className="rounded-12 overflow-hidden">
      {/* Image plein cadre + overlay texte */}
      <div className="relative w-full h-[230px] rounded-2xl overflow-hidden">
        <Image 
          key={`prayer-${lastPrayer.key}-${imageKey}`} 
          src={imgSrc} 
          alt={lastPrayer.label} 
          fill 
          sizes="100vw" 
          className="object-cover" 
          onError={() => setImgSrc("/hero-creteil-2.png")}
          priority
        />
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
          <div className="relative p-3" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)` }}>
            <div className="text-white text-[15px] md:text-[16px] font-[600] tracking-[-0.2px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              Prière actuelle : <span className="font-[700]">{lastPrayer.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Texte et barre sous la photo */}
      <div className="pt-3 pb-4 px-0">
        <div className="flex items-center gap-2 text-[13.75px] md:text-[14.25px] font-[500] tracking-[-0.2px] text-white" aria-label={`Prochaine ${nextPrayer.label} à ${nextTimeLabel} dans ${etaLabel}`}>
          <Clock size={16} className="text-white/70" />
          <span>Prochaine prière <span className="font-[600]">{nextPrayer.label}</span> dans <span className="tabular-nums">{etaLabel}</span> : <span className="font-[600] tabular-nums">{nextTimeLabel}</span></span>
        </div>
        <div className="mt-3">
          {/* Progress: elapsed vs total between prayers */}
          <div className="relative h-[10px] rounded-full bg-white/15 overflow-hidden" aria-hidden={false}>
            {/* Fill */}
            <div
              className="h-full bg-white"
              style={{
                width: `${widthPctRaw}%`,
                minWidth: widthPctRaw > 0 ? "2px" : undefined,
                transition: prefersReducedMotion ? undefined : "width 1000ms linear",
              }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(widthPctRaw)}
            />
          </div>
          {debug && (
            <div className="mt-2 text-[11px] text-white/70">
              elapsed {Math.round(elapsedMinutes)} min / total {Math.round(totalMinutes)} min → {widthPctRaw.toFixed(2)}%
            </div>
          )}
      </div>
      </div>
      {ariaLiveMessage ? <div aria-live="polite" className="sr-only">{ariaLiveMessage}</div> : null}
    </section>
  );
}

