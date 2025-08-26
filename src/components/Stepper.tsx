"use client";

import { cn } from "@/lib/cn";

export function Stepper({ activeStep = 0 }: { activeStep?: number }) {
  const steps = ["Amount", "Info", "Payment"];
  
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div key={step} className="stepper-item">
          <div className={cn(
            "stepper-dot",
            index === activeStep && "active",
            index < activeStep && "completed"
          )} />
          <span className={cn(
            "stepper-label",
            index === activeStep && "active",
            index < activeStep && "completed"
          )}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

