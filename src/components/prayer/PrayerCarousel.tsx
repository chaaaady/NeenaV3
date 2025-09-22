"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

export type CarouselItem = {
  key: string;
  label: string;
  timeLabel: string; // HH:MM
  state: "past" | "current" | "upcoming";
  etaLabel?: string; // for current/upcoming
};

export type PrayerCarouselProps = {
  items: CarouselItem[];
  currentKey?: string;
};

export default function PrayerCarousel({ items, currentKey }: PrayerCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = Math.max(0, items.findIndex((x) => x.key === currentKey));
    setActiveIdx(idx);
    const child = containerRef.current.children[idx] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentKey, items]);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el || el.children.length === 0) return;
    const centerX = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement;
      const rect = c.getBoundingClientRect();
      const cCenter = el.scrollLeft + (rect.left - el.getBoundingClientRect().left) + rect.width / 2;
      const d = Math.abs(cCenter - centerX);
      if (d < minDist) { minDist = d; nearest = i; }
    }
    setActiveIdx(nearest);
  };

  return (
    <section role="region" aria-roledescription="carousel" aria-label="Exploration des prières" className="space-y-2">
      <div ref={containerRef} onScroll={onScroll} className="-mx-3 px-3 overflow-x-auto snap-x snap-mandatory flex gap-3 scroll-smooth">
        {items.map((it) => (
          <article key={it.key} className="relative snap-center flex-[0_0_86%] rounded-12 border border-[var(--hairline-light)] dark:border-[var(--hairline-dark)] bg-white dark:bg-[#111315] p-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
            {it.state === "past" && (
              <div className="absolute right-3 top-3 text-[var(--text-muted)]"><Check size={16} /></div>
            )}
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-[16px] font-[700] text-[var(--text)]">
                {it.label} • <span className="tabular-nums">{it.timeLabel}</span>
              </div>
            </div>
            {it.state === "current" ? (
              <div className="mt-3 text-[13px] text-[var(--text)]">{it.etaLabel ? `Il reste ${it.etaLabel}` : "En cours"}</div>
            ) : it.state === "upcoming" ? (
              <div className="mt-3 text-[13px] text-[var(--text)]">{it.etaLabel ? `dans ${it.etaLabel}` : "À venir"}</div>
            ) : (
              <div className="mt-3 text-[13px] text-[var(--text-muted)]">Effectuée</div>
            )}
          </article>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-center gap-1">
        {items.map((_, i) => (
          <span key={i} className={i === activeIdx ? "h-1.5 w-3 rounded-full bg-black/50 dark:bg-white/60" : "h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/25"} />
        ))}
      </div>
    </section>
  );
}

