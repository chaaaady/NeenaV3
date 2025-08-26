"use client";

import { DonationFormValues } from "@/lib/schema";

export function buildDonationSummary(values: DonationFormValues): string {
  const freqSuffix =
    values.frequency === "Weekly" ? "/week" :
    values.frequency === "Monthly" ? "/month" : "";

  const donorPhrase =
    values.donorType === "Company"
      ? (values.companyName ? `the company ${values.companyName}` : "a company")
      : (values.donorType === "In honor of"
          ? (values.tributeName ? `in honor of ${values.tributeName}` : "in honor of someone")
          : "");

  const donorPart = donorPhrase ? ` as ${donorPhrase}` : "";

  return `You have donated €${values.amount}${freqSuffix}${donorPart} to ${values.mosqueName} as ${values.donationType}. May Allah bless you and your family and reward your generosity.`;
}

