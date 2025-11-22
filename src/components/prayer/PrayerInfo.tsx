"use client";

import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";
import { Clock } from "lucide-react";

interface PrayerInfoProps {
  mosqueeSlug?: string;
}

const PRAYER_NAMES: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function PrayerInfo({ mosqueeSlug = "mosquee-sahaba-creteil" }: PrayerInfoProps) {
  const currentPrayer = useCurrentPrayer(mosqueeSlug);
  
  // Get next prayer
  const currentIndex = PRAYER_ORDER.indexOf(currentPrayer);
  const nextPrayerKey = currentIndex >= 0 
    ? PRAYER_ORDER[(currentIndex + 1) % PRAYER_ORDER.length]
    : "fajr";
  
  const currentPrayerName = PRAYER_NAMES[currentPrayer] || "Fajr";
  const nextPrayerName = PRAYER_NAMES[nextPrayerKey] || "Dhuhr";

  return (
    <div className="flex items-center gap-2 text-white/90 text-[12px]">
      {/* Current Prayer */}
      <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-2.5 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="font-semibold">{currentPrayerName}</span>
      </div>

      {/* Next Prayer */}
      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 py-1">
        <Clock className="w-3 h-3" />
        <span className="font-medium text-white/70">Prochain: {nextPrayerName}</span>
      </div>
    </div>
  );
}

