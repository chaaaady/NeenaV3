export function formatEuro(amount: number): string {
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  // Ensure format '€ X' (no decimals, space after € when locale does)
  return formatter.format(amount).replace("EUR", "").trim();
}

