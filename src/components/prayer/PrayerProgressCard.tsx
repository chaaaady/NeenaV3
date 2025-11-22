"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface PrayerProgressCardProps {
  mosqueeSlug?: string;
  prayerTimes?: Record<string, string> | null;
}

const PRAYER_NAMES: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function PrayerProgressCard({ prayerTimes }: PrayerProgressCardProps) {
  const [currentPrayerKey, setCurrentPrayerKey] = useState<string>("fajr");
  const [nextPrayerKey, setNextPrayerKey] = useState<string>("dhuhr");
  const [currentPrayerTime, setCurrentPrayerTime] = useState<string>("");
  const [nextPrayerTime, setNextPrayerTime] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const calculateProgress = () => {
      // Utiliser les horaires par défaut si pas de props
      const times: Record<string, string> = prayerTimes && Object.keys(prayerTimes).length > 0 
        ? prayerTimes 
        : {
            fajr: "06:21",
            dhuhr: "12:39",
            asr: "15:05",
            maghrib: "17:35",
            isha: "19:25"
          };

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Convertir tous les horaires en minutes
      const prayerTimesInMinutes = PRAYER_ORDER.map(prayer => ({
        key: prayer,
        time: times[prayer],
        minutes: timeToMinutes(times[prayer])
      }));

      // Déterminer la prière actuelle en fonction de l'heure
      let currentPrayer = prayerTimesInMinutes[prayerTimesInMinutes.length - 1]; // Par défaut Isha
      let nextPrayer = prayerTimesInMinutes[0]; // Par défaut Fajr (lendemain)

      // Trouver la tranche horaire actuelle
      for (let i = 0; i < prayerTimesInMinutes.length; i++) {
        if (currentMinutes >= prayerTimesInMinutes[i].minutes) {
          currentPrayer = prayerTimesInMinutes[i];
          // La prochaine prière est la suivante dans la liste
          if (i + 1 < prayerTimesInMinutes.length) {
            nextPrayer = prayerTimesInMinutes[i + 1];
          } else {
            nextPrayer = prayerTimesInMinutes[0]; // Fajr du lendemain
          }
        } else {
          // Si l'heure actuelle est avant cette prière, on arrête
          break;
        }
      }

      setCurrentPrayerKey(currentPrayer.key);
      setNextPrayerKey(nextPrayer.key);
      setCurrentPrayerTime(currentPrayer.time);
      setNextPrayerTime(nextPrayer.time);

      // Calculer la progression
      const currentPrayerMinutes = currentPrayer.minutes;
      let nextPrayerMinutes = nextPrayer.minutes;

      // Si la prochaine prière est le lendemain (ex: Isha -> Fajr)
      if (nextPrayerMinutes <= currentPrayerMinutes) {
        nextPrayerMinutes += 1440; // +24h
      }

      const totalDuration = nextPrayerMinutes - currentPrayerMinutes;
      let elapsed = currentMinutes - currentPrayerMinutes;
      
      if (elapsed < 0) {
        elapsed = 0;
      }

      const progressPercent = (elapsed / totalDuration) * 100;
      const finalProgress = Math.min(100, Math.max(0, progressPercent));
      
      // Calculer le temps restant
      const remainingMinutes = totalDuration - elapsed;
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = Math.floor(remainingMinutes % 60);
      
      let timeRemainingText = "";
      if (hours > 0) {
        timeRemainingText = `Prochaine prière dans ${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
      } else {
        timeRemainingText = `Prochaine prière dans ${minutes}min`;
      }
      
      // Debug info removed for production
      
      setProgress(finalProgress);
      setTimeRemaining(timeRemainingText);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // Mise à jour chaque minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const currentPrayer = PRAYER_NAMES[currentPrayerKey] || "Fajr";
  const nextPrayer = PRAYER_NAMES[nextPrayerKey] || "Dhuhr";

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-4">
      <div className="flex items-center justify-between mb-3">
        {/* Current Prayer */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white font-semibold text-[15px]">{currentPrayer}</span>
          </div>
          {currentPrayerTime && (
            <span className="text-white/70 text-[12px] ml-4">{currentPrayerTime}</span>
          )}
        </div>

        {/* Next Prayer */}
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white font-semibold text-[15px]">{nextPrayer}</span>
          </div>
          {nextPrayerTime && (
            <span className="text-white/70 text-[12px] mr-1">{nextPrayerTime}</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Remaining */}
      {timeRemaining && (
        <div className="mt-2.5 text-center">
          <span className="text-white/70 text-[13px] font-medium">{timeRemaining}</span>
        </div>
      )}
    </div>
  );
}

