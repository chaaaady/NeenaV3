"use client";

export function SummaryRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="summary-row">
      <div className="flex-1 text-[14px] font-[700]">{left}</div>
      <div className="text-[14px] font-[700]">{right}</div>
    </div>
  );
}

