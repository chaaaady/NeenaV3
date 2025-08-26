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
    <div className="stepper-container">
      <div className="flex items-center justify-center gap-2">
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
      <div className="text-[12px] text-[var(--text-muted)] font-[600] text-center mt-1">
        {currentStep}/{totalSteps}
      </div>
    </div>
  );
}

