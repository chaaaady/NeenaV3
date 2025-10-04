"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, children, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border",
        "border-white/15",
        "bg-gradient-to-br from-white/[0.18] to-white/[0.12]",
        "backdrop-blur-xl shadow-2xl",
        "p-6 md:p-7",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}