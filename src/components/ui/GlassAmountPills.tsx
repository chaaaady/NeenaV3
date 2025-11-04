"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassAmountPillsProps = {
  amounts: number[];
  activeAmount?: number;
  onSelect: (amount: number) => void;
  className?: string;
  variant?: "light" | "white";
};

export function GlassAmountPills({ amounts, activeAmount, onSelect, className, variant = "light" }: GlassAmountPillsProps) {
  const baseBtn = "h-11 flex items-center justify-center px-2 text-[16px] font-semibold transition-colors duration-200 ease-out focus-visible:outline-none relative z-10";
  const inactive = variant === "white"
    ? "text-gray-700"
    : "text-white/75";
  const active = variant === "white"
    ? "text-gray-900"
    : "text-zinc-900";

  const activeIndex = amounts.indexOf(activeAmount ?? -1);
  const cols = 3;
  const row = Math.floor(activeIndex / cols);
  const col = activeIndex % cols;
  
  const sliderWidth = `calc((100% - ${(cols - 1) * 12}px) / ${cols})`;
  const sliderTop = `calc(${row * 44 + row * 12}px)`;
  const sliderLeft = `calc(((100% - ${(cols - 1) * 12}px) / ${cols}) * ${col} + ${col * 12}px)`;

  const sliderBg = variant === "white"
    ? "bg-white/80 shadow-md backdrop-blur-md border border-white/30"
    : "bg-white/85 shadow-lg";

  return (
    <div className={cn("relative grid grid-cols-3 gap-3", className)} role="group" aria-label="Sélection du montant">
      {/* Sliding background */}
      {activeAmount !== undefined && activeIndex >= 0 && (
        <div
          className={cn("absolute h-11 rounded-2xl transition-all duration-200 ease-out", sliderBg)}
          style={{
            width: sliderWidth,
            top: sliderTop,
            left: sliderLeft,
          }}
        />
      )}
      {amounts.map((amt) => {
        const isActive = activeAmount === amt;
        return (
          <button
            key={amt}
            type="button"
            aria-pressed={isActive}
            className={cn(baseBtn, isActive ? active : inactive)}
            onClick={() => onSelect(amt)}
          >
            {amt} €
          </button>
        );
      })}
    </div>
  );
}