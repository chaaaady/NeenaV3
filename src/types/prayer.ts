export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerSlot {
  name: PrayerName;
  start: Date;
  end: Date;
  iqama?: Date | null;
}

