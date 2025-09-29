"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  minRows?: number;
};

export function GlassTextarea({ className, minRows = 4, ...props }: GlassTextareaProps) {
  return (
    <textarea
      {...props}
      rows={minRows}
      className={cn(
        "w-full rounded-3xl px-4 py-3",
        "ring-1 ring-white/15 bg-white/8",
        "backdrop-blur-md text-white placeholder-white/60",
        "focus:outline-none focus:ring-2 focus:ring-white/35",
        "resize-none",
        className
      )}
    />
  );
}


