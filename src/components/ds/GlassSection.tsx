"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GlassSectionProps = React.PropsWithChildren<{
  className?: string;
}>;

export function GlassSection({ className, children }: GlassSectionProps) {
  return (
    <div className={cn("w-full rounded-2xl bg-white/10 p-3.5", className)}>{children}</div>
  );
}