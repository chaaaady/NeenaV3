"use client";

import { Info } from "lucide-react";

export function InlineNote({ 
  text, 
  amount, 
  currency = "€",
  frequency 
}: { 
  text?: string; 
  amount?: number;
  currency?: string;
  frequency?: "One time" | "Weekly" | "Monthly";
}) {
  const getTaxDeductionText = () => {
    if (amount && amount > 0) {
      const realCost = Math.round(amount * 0.34 * 100) / 100;
      const frequencySuffix = frequency === "Weekly" ? "/week" : frequency === "Monthly" ? "/month" : "";
      return `Your donation actually only costs you ${currency}${realCost}${frequencySuffix} after tax deduction.`;
    }
    return text || "";
  };

  return (
    <div className="inline-note">
      <Info size={16} className="text-[var(--text-soft)] mt-[1px] flex-shrink-0" />
      <span className="text-[13px] text-[var(--text-muted)] font-[500]">{getTaxDeductionText()}</span>
    </div>
  );
}

