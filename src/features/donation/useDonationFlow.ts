"use client";

import { useRouter } from "next/navigation";
import { DonationFormValues } from "@/lib/schema";

export function useDonationFlow() {
  const router = useRouter();

  return {
    toAmount: () => router.push("/step-amount"),
    toPersonal: () => router.push("/step-personal"),
    toPayment: () => router.push("/step-payment"),
    backToPersonal: () => router.push("/step-personal"),
    goHome: () => router.push("/"),

    canProceedFromAmount: (v: DonationFormValues) => v.amount > 0 && !!v.mosqueName,
    canProceedFromPersonal: (v: DonationFormValues) =>
      v.donorType === "Entreprise" 
        ? !!(v.companyName && v.companySiret)
        : !!(v.firstName && v.lastName && v.email),
  };
}

