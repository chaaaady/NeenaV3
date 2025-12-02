import { useState, useEffect } from "react";

// Hook pour déterminer la prière actuelle en fonction de l'heure
export function useCurrentPrayer(mosqueeSlug?: string): string {
  const [currentPrayer, setCurrentPrayer] = useState<string>("fajr");

  useEffect(() => {
    // Mode debug pour forcer une prière spécifique (via URL)
    const debugPrayer = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get("prayer")
      : null;

    if (debugPrayer) {
      setCurrentPrayer(debugPrayer);
      return;
    }

    const updatePrayer = async () => {
      try {
        // Récupérer les horaires de prière depuis l'API Mawaqit
        const response = await fetch(`/api/mawaqit?mosque=${mosqueeSlug || "mosquee-sahaba-creteil"}`);
        
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        
        if (!data.calendar) {
          return;
        }

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Convertir les horaires en minutes
        const parseTime = (timeStr: string) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };

        const fajrTime = parseTime(data.calendar.fajr);
        const dhuhrTime = parseTime(data.calendar.dhuhr);
        const asrTime = parseTime(data.calendar.asr);
        const maghribTime = parseTime(data.calendar.maghrib);
        const ishaTime = parseTime(data.calendar.isha);

        // Déterminer la prière actuelle
        if (currentTime >= ishaTime || currentTime < fajrTime) {
          setCurrentPrayer("isha");
        } else if (currentTime >= maghribTime) {
          setCurrentPrayer("maghrib");
        } else if (currentTime >= asrTime) {
          setCurrentPrayer("asr");
        } else if (currentTime >= dhuhrTime) {
          setCurrentPrayer("dhuhr");
        } else {
          setCurrentPrayer("fajr");
        }
      } catch {
        // Silent fail - keep current prayer
      }
    };

    updatePrayer();
    
    // Mettre à jour toutes les minutes
    const interval = setInterval(updatePrayer, 60000);
    
    return () => clearInterval(interval);
  }, [mosqueeSlug]);

  return currentPrayer;
}

