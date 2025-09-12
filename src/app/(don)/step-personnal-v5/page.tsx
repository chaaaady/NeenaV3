"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DonationFormValues, defaultDonationValues } from "@/lib/schema";

export default function Page() {
  const router = useRouter();
  const [values, setValues] = useState<DonationFormValues>({ ...defaultDonationValues });

  const update = (k: keyof DonationFormValues) => (val: string) => setValues((v) => ({ ...v, [k]: val }));
  const canContinue = !!(values.firstName && values.lastName && values.email);

  return (
    <main className="app-container pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
      <div className="app-card mt-2">
        <div className="space-y-4">
          <div className="app-title">Informations personnelles (V5)</div>
          <div className="grid gap-3">
            <label className="block">
              <span className="block text-[13px] text-[var(--text-muted)] mb-1">Prénom</span>
              <input className="app-input w-full" value={values.firstName} onChange={(e) => update("firstName")(e.target.value)} placeholder="Votre prénom" />
            </label>
            <label className="block">
              <span className="block text-[13px] text-[var(--text-muted)] mb-1">Nom</span>
              <input className="app-input w-full" value={values.lastName} onChange={(e) => update("lastName")(e.target.value)} placeholder="Votre nom" />
            </label>
            <label className="block">
              <span className="block text-[13px] text-[var(--text-muted)] mb-1">Email</span>
              <input className="app-input w-full" type="email" value={values.email} onChange={(e) => update("email")(e.target.value)} placeholder="vous@exemple.com" />
            </label>
            <label className="block">
              <span className="block text-[13px] text-[var(--text-muted)] mb-1">Adresse</span>
              <input className="app-input w-full" value={values.address} onChange={(e) => update("address")(e.target.value)} placeholder="Adresse complète" />
            </label>
          </div>
          <div className="mt-2 flex gap-3">
            <a href="/step-amount-v2" className="btn-secondary pressable flex-1 text-center py-3">Retour</a>
            <button
              disabled={!canContinue}
              onClick={() => canContinue && router.push("/step-payment")}
              className="btn-primary pressable flex-1 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continuer vers paiement
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

