"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type StepName = "Montant" | "Information" | "Paiement" | "Merci";

export type StepLabelsProps = {
  current: StepName;
  previous?: StepName[];
  className?: string;
};

export function StepLabels({ current, className }: StepLabelsProps) {
  const allSteps: StepName[] = ["Montant", "Information", "Paiement"];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {allSteps.map((label, idx) => {
        const isCurrent = label === current;
        return (
          <React.Fragment key={label}>
            {idx > 0 && <span className="text-white/40">·</span>}
            <span
              className={cn(
                "inline-flex items-center text-[13px]",
                isCurrent ? "text-white font-semibold" : "text-white/60 font-medium"
              )}
            >
              {label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}