"use client";

import { ChevronRight } from "lucide-react";

export function CompactSummaryRow({
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
      className="compact-summary-row w-full text-[15px]"
      onClick={onClick}
      aria-label={`${label} ${value}`}
    >
      <span className="text-[var(--text-muted)] font-[600] text-[15px]">{label}</span>
      <span className="flex items-center gap-2 text-[var(--text-soft)] font-[600] text-[15px]">
        {value}
        {onClick && <ChevronRight size={16} className="text-[var(--text-soft)]" />}
      </span>
    </button>
  );
}

