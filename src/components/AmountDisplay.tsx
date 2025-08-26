"use client";

export function AmountDisplay({ 
  currency = "€", 
  amount, 
  frequency 
}: { 
  currency?: string; 
  amount: number;
  frequency?: "One time" | "Weekly" | "Monthly";
}) {
  const getFrequencySuffix = () => {
    if (frequency === "Weekly") return "/week";
    if (frequency === "Monthly") return "/month";
    return "";
  };

  return (
    <div className="text-center">
      <span className="align-baseline text-[28px] font-[800] tracking-[-0.5px] mr-1">{currency}</span>
      <span className="text-[40px] font-[800] tracking-[-0.5px]">{amount}</span>
      {frequency && frequency !== "One time" && (
        <span className="align-baseline text-[20px] font-[600] tracking-[-0.3px] ml-2 text-[var(--text-muted)]">
          {getFrequencySuffix()}
        </span>
      )}
    </div>
  );
}

