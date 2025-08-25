"use client";

import { DonationFormProvider } from "@/components/DonationFormProvider";

export default function DonLayout({ children }: { children: React.ReactNode }) {
  return <DonationFormProvider>{children}</DonationFormProvider>;
}