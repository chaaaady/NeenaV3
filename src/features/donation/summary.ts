"use client";

import { DonationFormValues } from "@/lib/schema";

export function buildDonationSummary(values: DonationFormValues): string {
  const freqSuffix =
    values.frequency === "Vendredi" ? "/Vendredi" :
    values.frequency === "Mensuel" ? "/mois" : "";

  const donorPhrase =
    values.donorType === "Entreprise"
      ? (values.companyName ? `l'entreprise ${values.companyName}` : "une entreprise")
      : (values.donorType === "En hommage"
          ? (values.tributeName ? `au nom de ${values.tributeName}` : "au nom de quelqu'un")
          : "");

  const donorPart = donorPhrase ? ` ${donorPhrase}` : "";

  const typeLabel = values.donationType === "Special" && values.specialDonation
    ? `Special (${values.specialDonation})`
    : values.donationType;

  return `${values.amount}€${freqSuffix}${donorPart} en ${typeLabel}${values.wantsReceipt ? " avec reçu fiscal" : ""}.`;
}

