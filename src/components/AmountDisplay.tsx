"use client";

export function AmountDisplay({ 
  currency = "€", 
  amount, 
  frequency 
}: { 
  currency?: string; 
  amount: number;
  frequency?: "Unique" | "Hebdomadaire" | "Mensuel";
}) {
  const getFrequencySuffix = () => {
    if (frequency === "Hebdomadaire") return "/semaine";
    if (frequency === "Mensuel") return "/mois";
    return "";
  };

  return (
    <div className="text-center">
      <span className="text-[40px] font-[800] tracking-[-0.5px]">{amount}</span>
      <span className="align-baseline text-[28px] font-[800] tracking-[-0.5px] ml-1">{currency}</span>
      {frequency && frequency !== "Unique" && (
        <span className="align-baseline text-[20px] font-[600] tracking-[-0.3px] ml-2 text-[var(--text-muted)]">
          {getFrequencySuffix()}
        </span>
      )}
    </div>
  );
}

