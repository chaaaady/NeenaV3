import { PrayerName } from "@/types/prayer";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export function getProgress(now: Date, start: Date, end: Date): { fraction: number; percent: number } {
  const total = Math.max(1, end.getTime() - start.getTime());
  const elapsed = clamp(now.getTime() - start.getTime(), 0, total);
  const fraction = elapsed / total;
  const percent = Math.round(fraction * 100);
  return { fraction, percent };
}

export function getThird(fraction: number): 1 | 2 | 3 {
  if (fraction < 1 / 3) return 1;
  if (fraction < 2 / 3) return 2;
  return 3;
}

export function getMinutesLeft(now: Date, end: Date): number {
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 60000));
}

export function fmtHHMM(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function getColor(third: 1 | 2 | 3, isMaghribEndingSoon: boolean): "green" | "amber" | "red" | "redDark" {
  if (isMaghribEndingSoon) return "redDark";
  if (third === 1) return "green";
  if (third === 2) return "amber";
  return "red";
}

export function getStatusLabel(name: PrayerName, third: 1 | 2 | 3, minutesLeft: number): string {
  const isMaghribEndingSoon = name === "Maghrib" && minutesLeft <= 5;
  if (third === 1) return "Meilleur moment : maintenant";
  if (third === 2) return "À ne pas trop retarder";
  return isMaghribEndingSoon ? "Dernier délai (Maghrib)" : "Dernier délai";
}

