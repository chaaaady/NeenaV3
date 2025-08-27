"use client";

import { cn } from "@/lib/cn";

interface Step {
  label: string;
  status: "pending" | "active" | "completed";
}

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, _index) => (
        <div key={step.label} className="stepper-item">
          <div className={cn(
            "stepper-dot",
            step.status === "active" && "active",
            step.status === "completed" && "completed"
          )} />
        </div>
      ))}
    </div>
  );
}

