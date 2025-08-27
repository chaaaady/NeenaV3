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
    <div className="amount-display">
      <span className="amount-value">{amount}</span>
      <span className="amount-currency">{currency}</span>
      {frequency && frequency !== "Unique" && (
        <span className="amount-suffix">{getFrequencySuffix()}</span>
      )}
    </div>
  );
}

