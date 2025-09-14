"use client";

import { useEffect, useRef, useState } from "react";

export function SectionHeader({ title }: { title: string | null }) {
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!title) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      className={
        "fixed left-0 right-0 top-0 z-50 will-change-transform " +
        "bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5"
      }
      style={{
        transition: reduce ? undefined : "transform 180ms ease, opacity 180ms ease",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: 560, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="text-[15px] font-[800] text-[var(--text)] truncate">{title}</div>
          <div className="flex items-center gap-2">
            <a href="#map" className="btn-secondary pressable h-9 px-4 flex items-center justify-center">Itinéraire</a>
            <a href="/step-amount-v2" className="btn-primary pressable h-9 px-4 flex items-center justify-center">Faire un don</a>
          </div>
        </div>
      </div>
    </div>
  );
}

