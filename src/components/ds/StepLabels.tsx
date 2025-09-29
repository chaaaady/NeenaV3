"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type StepName = "Montant" | "Information" | "Paiement" | "Merci";

export type StepLabelsProps = {
  current: StepName;
  previous?: StepName[];
  className?: string;
};

export function StepLabels({ current, previous = ["Montant", "Information", "Paiement"], className }: StepLabelsProps) {
  const sequence = React.useMemo(() => {
    const ordered: StepName[] = [];
    for (const step of previous) {
      if (!ordered.includes(step)) ordered.push(step);
    }
    if (!ordered.includes(current)) {
      ordered.push(current);
    }
    return ordered;
  }, [current, previous]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {sequence.map((label) => {
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