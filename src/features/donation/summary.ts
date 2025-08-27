"use client";

import { DonationFormValues } from "@/lib/schema";

export function buildDonationSummary(values: DonationFormValues): string {
  const freqSuffix =
    values.frequency === "Hebdomadaire" ? "/semaine" :
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

  return `Je souhaite donner ${values.amount}€${freqSuffix}${donorPart} à la mosquée de ${values.mosqueName} en ${typeLabel}${values.wantsReceipt ? " avec reçu fiscal" : ""}.`;
}

