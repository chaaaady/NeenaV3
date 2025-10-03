"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassSegmentedProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  ariaLabel?: string;
  variant?: "light" | "dark";
  className?: string;
};

export function GlassSegmented({ options, value, onChange, ariaLabel, variant = "light", className }: GlassSegmentedProps) {
  const container = variant === "light"
    ? "overflow-hidden rounded-2xl bg-white/12 p-1.5"
    : "overflow-hidden rounded-2xl bg-black/30 p-1.5 backdrop-blur-md";

  const baseBtn = "h-11 flex-1 rounded-2xl px-6 text-[16px] font-semibold transition-all duration-300 focus-visible:outline-none";
  const inactive = variant === "light"
    ? "text-white/75 hover:bg-white/8"
    : "text-white/80 hover:bg-white/10";
  const active = variant === "light"
    ? "bg-white/85 text-zinc-900 shadow-lg"
    : "bg-white/85 text-zinc-900 shadow-lg";

  return (
    <div className={cn(container, className)} role="tablist" aria-label={ariaLabel}>
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const isActive = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(baseBtn, isActive ? active : inactive)}
              onClick={() => onChange(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}