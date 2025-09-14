"use client";

import { useEffect, useRef, useState } from "react";

export function SectionHeader({ title }: { title: string | null }) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!title) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-live="polite"
      className={
        "fixed left-0 right-0 z-[90] will-change-transform " +
        "bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5 " +
        "top-[var(--global-header-h,0px)]"
      }
      style={{
        transition: reduce ? undefined : "transform 180ms ease, opacity 180ms ease",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: 560, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10 }}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] font-[700] text-[var(--text)] truncate">{title}</div>
          <div className="flex items-center gap-2">
            <a href="#map" className="btn-secondary pressable h-9 px-3">Itinéraire</a>
            <a href="/step-amount-v2" className="btn-primary pressable h-9 px-3">Donner</a>
          </div>
        </div>
      </div>
    </div>
  );
}

