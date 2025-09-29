const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export function formatEuro(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return euroFormatter.format(amount).replace("EUR", "").trim();
}

