"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type StepName = "Montant" | "Information" | "Paiement" | "Merci";

export type StepLabelsProps = {
  current: StepName;
  previous?: StepName[];
  className?: string;
  variant?: "light" | "dark";
};

export function StepLabels({ current, className, variant = "light" }: StepLabelsProps) {
  const allSteps: StepName[] = ["Montant", "Information", "Paiement"];

  const separatorClass = variant === "dark" ? "text-gray-400" : "text-white/40";
  const currentClass = variant === "dark" ? "text-gray-900 font-semibold" : "text-white font-semibold";
  const inactiveClass = variant === "dark" ? "text-gray-600 font-medium" : "text-white/60 font-medium";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {allSteps.map((label, idx) => {
        const isCurrent = label === current;
        return (
          <React.Fragment key={label}>
            {idx > 0 && <span className={separatorClass}>·</span>}
            <span
              className={cn(
                "inline-flex items-center text-[13px]",
                isCurrent ? currentClass : inactiveClass
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