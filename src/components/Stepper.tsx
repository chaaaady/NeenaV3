"use client";

import { cn } from "@/lib/cn";

interface Step {
  label: string;
  status: "pending" | "active" | "completed";
}

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div key={step.label} className="stepper-item">
          <div className={cn(
            "stepper-dot",
            step.status === "active" && "active",
            step.status === "completed" && "completed"
          )} />
          <span className={cn(
            "stepper-label",
            step.status === "active" && "active",
            step.status === "completed" && "completed"
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

