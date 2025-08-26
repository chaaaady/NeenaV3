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

  return `Je souhaite donner ${values.amount}€${freqSuffix}${donorPart} à la mosquée de ${values.mosqueName} en ${values.donationType}${values.wantsReceipt ? " avec reçu fiscal" : ""}.`;
}

