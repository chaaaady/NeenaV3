"use client";

import React from "react";
import { useTick } from "@/hooks/useTick";

type Props = { embedded?: boolean };

export default function CurrentTimeSection({ embedded }: Props = {}) {
  const now = useTick(30000);
  // const gregorianFull = now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  let hijriFull = "";
  try {
    // Affiche seulement jour/mois/année hégiriens (sans le jour de semaine)
    hijriFull = new Intl.DateTimeFormat("fr-FR-u-ca-islamic", { year: "numeric", month: "long", day: "numeric" }).format(now);
  } catch {
    hijriFull = "—"; // fallback
  }

  if (embedded) return null;

  return (
    <section aria-label="Heure et date actuelles">
      <div className={embedded ? "p-0" : "rounded-12 border border-[var(--border)] p-5 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)]"}>
        <div className="flex items-center justify-end">
          <div className="text-[13px] text-[var(--text-muted)]">{hijriFull}</div>
        </div>
      </div>
    </section>
  );
}

