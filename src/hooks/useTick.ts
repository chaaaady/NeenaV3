"use client";

import { useEffect, useState } from "react";

/**
 * Returns a Date object that updates every `intervalMs` milliseconds.
 * Defaults to 1000ms. Uses a single interval and clears it on unmount.
 */
export function useTick(intervalMs: number = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Guard against non-positive intervals; fall back to 1000ms
    const safeInterval = Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 1000;
    const id = setInterval(() => setNow(new Date()), safeInterval);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

