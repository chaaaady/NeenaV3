"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  rightAdornment?: React.ReactNode;
};

export function GlassInput({ className, rightAdornment, ...props }: GlassInputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        className={cn(
          "w-full h-11 rounded-2xl px-4 pr-10 ring-1 ring-white/12 backdrop-blur-md",
          "focus:outline-none focus:ring-2 focus:ring-white/35",
          "text-white placeholder-white/70",
          "text-[17px]",
          className
        )}
      />
      {rightAdornment ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/75">{rightAdornment}</span>
      ) : null}
    </div>
  );
}