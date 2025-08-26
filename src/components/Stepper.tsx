"use client";

import { cn } from "@/lib/cn";

interface Step {
  label: string;
  status: "pending" | "active" | "completed";
}

export function Stepper({ steps }: { steps: Step[] }) {
  const currentStep = steps.findIndex(step => step.status === "active") + 1;
  const totalSteps = steps.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {steps.map((step, index) => (
          <div key={step.label} className="stepper-item">
            <div className={cn(
              "stepper-dot",
              step.status === "active" && "active",
              step.status === "completed" && "completed"
            )} />
          </div>
        ))}
      </div>
      <div className="text-[11px] text-[var(--text-muted)] font-[600]">
        {currentStep}/{totalSteps}
      </div>
    </div>
  );
}

