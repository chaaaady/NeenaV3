"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type StepLabelsProps = {
  current: "Montant" | "Information" | "Paiement" | "Merci";
  previous?: Array<"Montant" | "Information" | "Paiement">;
  className?: string;
};

export function StepLabels({ current, previous = ["Montant", "Information", "Paiement"], className }: StepLabelsProps) {
  const all = previous.includes(current as any) ? previous : [...previous, current] as const;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {all.map((label) => {
        const isCurrent = label === current;
        return (
          <span
            key={label}
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 text-[13px]",
              isCurrent ? "rounded-full bg-white/18 text-white font-semibold" : "text-white/85 font-medium"
            )}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}