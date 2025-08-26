"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationFormSchema, defaultDonationValues, type DonationFormValues } from "@/lib/schema";
import { loadFromStorage, saveToStorage, removeFromStorage } from "@/lib/storage";

const STORAGE_KEY = "neena.donation.form.v1";

type DonationContextValue = {
  form: ReturnType<typeof useForm<DonationFormValues>>;
  values: DonationFormValues;
  amountCurrency: string;
  infoSummary: string;
  resetAll: () => void;
};

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationFormProvider({ children }: { children: React.ReactNode }) {
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    mode: "onChange",
    defaultValues: defaultDonationValues,
  });

  // On mount: load saved values
  useEffect(() => {
    const saved = loadFromStorage<DonationFormValues>(STORAGE_KEY, defaultDonationValues);
    // Merge with defaults to avoid undefined fields (controlled inputs)
    const merged: DonationFormValues = { ...defaultDonationValues, ...(saved as Partial<DonationFormValues>) } as DonationFormValues;
    form.reset(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (light debounce via requestIdleCallback)
  useEffect(() => {
    const subscription = form.watch((values) => {
      const persist = () => saveToStorage(STORAGE_KEY, values as DonationFormValues);
      if (typeof (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback === "function") {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(persist);
      } else {
        setTimeout(persist, 150);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const values = form.getValues();

  const amountCurrency = useMemo(() => {
    return `${values.currency}${values.amount}`;
  }, [values.currency, values.amount]);

  const infoSummary = useMemo(() => {
    return values.information && values.information.trim().length > 0
      ? values.information
      : "Rida Zahra (exemple) ou contenu saisi";
  }, [values.information]);

  const resetAll = () => {
    form.reset(defaultDonationValues);
    removeFromStorage(STORAGE_KEY);
  };

  const ctx: DonationContextValue = { form, values, amountCurrency, infoSummary, resetAll };

  return (
    <FormProvider {...(form as unknown as Parameters<typeof FormProvider>[0])}>
      <DonationContext.Provider value={ctx}>{children}</DonationContext.Provider>
    </FormProvider>
  );
}

export function useDonation() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation must be used within DonationFormProvider");
  return ctx;
}