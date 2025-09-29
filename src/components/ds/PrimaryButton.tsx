"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  width?: "full" | "half" | "threeFifths";
  animate?: boolean;
  variant?: "white" | "black" | "glass";
};

export function PrimaryButton({ className, width = "half", animate = false, variant = "white", children, ...props }: PrimaryButtonProps) {
  const widthClass = width === "full" ? "w-full" : width === "threeFifths" ? "w-3/5" : "w-1/2";

  const base = "h-11 rounded-2xl px-6 font-semibold transition-all duration-300 ease-out focus:outline-none flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none";
  const visual = variant === "black"
    ? "bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-px focus:ring-2 focus:ring-white/30"
    : variant === "glass"
      ? "bg-white/12 text-white ring-1 ring-white/30 backdrop-blur-md shadow-md hover:shadow-lg hover:-translate-y-px focus:ring-2 focus:ring-white/30"
      : "bg-white text-black shadow-xl ring-1 ring-white/70 hover:shadow-2xl hover:-translate-y-px hover:brightness-[0.98] focus:ring-2 focus:ring-black/20";

  return (
    <button
      {...props}
      className={cn(
        widthClass,
        base,
        visual,
        animate && "group",
        className
      )}
    >
      <span className="inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}