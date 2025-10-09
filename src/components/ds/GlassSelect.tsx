"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

export type GlassSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
};

export function GlassSelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner...",
  className,
}: GlassSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-11 px-4 pr-10 rounded-2xl appearance-none",
          "border border-white/10 bg-white/10 backdrop-blur-md",
          "text-white text-[15px] font-medium",
          "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20",
          "transition-all cursor-pointer",
          "hover:bg-white/15"
        )}
      >
        <option value="" disabled className="bg-zinc-900 text-white">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-zinc-900 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown className="w-5 h-5 text-white/60" />
      </div>
    </div>
  );
}

