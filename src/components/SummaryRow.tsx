"use client";

import { ChevronRight } from "lucide-react";

export function SummaryRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="summary-row w-full text-[16px]"
      onClick={onClick}
      aria-label={`${label} ${value}`}
    >
      <span className="text-[var(--text-muted)] font-[700] text-[16px]">{label}</span>
      <span className="flex items-center gap-2 text-[var(--text-soft)] font-[600] text-[16px]">
        {value}
        {onClick && <ChevronRight size={18} className="text-[var(--text-soft)]" />}
      </span>
    </button>
  );
}

