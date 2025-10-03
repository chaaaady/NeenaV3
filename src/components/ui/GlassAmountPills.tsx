"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassAmountPillsProps = {
  amounts: number[];
  activeAmount?: number;
  onSelect: (amount: number) => void;
  className?: string;
};

export function GlassAmountPills({ amounts, activeAmount, onSelect, className }: GlassAmountPillsProps) {
  const activeCls = "rounded-2xl h-11 flex items-center justify-center px-4 text-[16px] font-semibold transition-all duration-300 bg-white/90 text-zinc-900 shadow-lg focus-visible:outline-none";
  const inactiveCls = "h-11 flex items-center justify-center px-2 text-[16px] font-semibold transition-all duration-300 bg-transparent text-white/80 hover:text-white focus-visible:outline-none";

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)} role="group" aria-label="Sélection du montant">
      {amounts.map((amt) => {
        const isActive = activeAmount === amt;
        return (
          <button
            key={amt}
            type="button"
            aria-pressed={isActive}
            className={cn(isActive ? activeCls : inactiveCls)}
            onClick={() => onSelect(amt)}
          >
            {amt} €
          </button>
        );
      })}
    </div>
  );
}