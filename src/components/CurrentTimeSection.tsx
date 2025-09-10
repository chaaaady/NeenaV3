"use client";

import React from "react";
import { useTick } from "@/hooks/useTick";

type Props = { embedded?: boolean };

export default function CurrentTimeSection({ embedded }: Props = {}) {
  const now = useTick(30000);

  const timeLabel = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const gregorianFull = now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  let hijriFull = "";
  try {
    // Affiche seulement jour/mois/année hégiriens (sans le jour de semaine)
    hijriFull = new Intl.DateTimeFormat("fr-FR-u-ca-islamic", { year: "numeric", month: "long", day: "numeric" }).format(now);
  } catch {
    hijriFull = "—"; // fallback
  }

  return (
    <section aria-label="Heure et date actuelles">
      <div className={embedded ? "p-0" : "rounded-12 border border-[var(--border)] p-5 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)]"}>
        <div className="flex items-start justify-between">
          <div className="text-left">
            <div className="text-[12px] text-[var(--text-muted)]">{gregorianFull}</div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">{hijriFull}</div>
          </div>
          <div
            className="text-[28px] font-[900] leading-none text-[var(--text)]"
            role="timer"
            aria-live="polite"
            aria-label={`Heure actuelle ${timeLabel}`}
          >
            {timeLabel}
          </div>
        </div>
      </div>
    </section>
  );
}

