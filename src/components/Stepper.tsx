"use client";

import { cn } from "@/lib/cn";

interface Step {
  label: string;
  status: "pending" | "active" | "completed";
}

export function Stepper({ steps }: { steps: Step[] }) {
  const current = steps.findIndex((s) => s.status === "active");
  const currentStep = current === -1 ? steps.findIndex((s) => s.status === "completed") + 1 : current + 1;
  const total = steps.length;

  return (
    <div className="text-[16px] font-[700] text-[var(--text)]">
      Étape {currentStep}/{total}
    </div>
  );
}

