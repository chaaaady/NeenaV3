"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassSegmentedProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  ariaLabel?: string;
  variant?: "light" | "dark" | "white";
  className?: string;
};

export function GlassSegmented({ options, value, onChange, ariaLabel, variant = "light", className }: GlassSegmentedProps) {
  const container = variant === "white"
    ? "overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 p-1.5"
    : variant === "light"
    ? "overflow-hidden rounded-2xl bg-white/12 p-1.5"
    : "overflow-hidden rounded-2xl bg-black/30 p-1.5 backdrop-blur-md";

  const baseBtn = "h-11 flex-1 rounded-2xl px-3 text-[15px] font-semibold transition-colors duration-200 ease-out focus-visible:outline-none whitespace-nowrap relative z-10";
  const inactive = variant === "white"
    ? "text-gray-700"
    : variant === "light"
    ? "text-white/75"
    : "text-white/80";
  const active = variant === "white"
    ? "text-gray-900"
    : variant === "light"
    ? "text-zinc-900"
    : "text-zinc-900";

  const activeIndex = options.indexOf(value);
  const gapSize = 6; // gap-1.5 = 6px
  const totalGaps = (options.length - 1) * gapSize;
  const sliderWidth = `calc((100% - ${totalGaps}px) / ${options.length})`;
  const sliderLeft = `calc(((100% - ${totalGaps}px) / ${options.length}) * ${activeIndex} + ${activeIndex * gapSize}px)`;

  const sliderBg = variant === "white"
    ? "bg-white/80 shadow-md backdrop-blur-md border border-white/30"
    : variant === "light"
    ? "bg-white/85 shadow-lg"
    : "bg-white/85 shadow-lg";

  return (
    <div className={cn(container, className)} role="tablist" aria-label={ariaLabel}>
      <div className="relative flex gap-1.5">
        {/* Sliding background */}
        <div
          className={cn("absolute h-11 rounded-2xl transition-all duration-200 ease-out", sliderBg)}
          style={{
            width: sliderWidth,
            left: sliderLeft,
          }}
        />
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