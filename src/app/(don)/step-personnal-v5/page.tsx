"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { DonationFormValues, defaultDonationValues } from "@/lib/schema";
import { AppBar, SideMenu, Input, SegmentedControl, Switch } from "@/components";

type DonorKind = "Personnel" | "Entreprise";

export default function Page() {
  const router = useRouter();
  const form = useFormContext<DonationFormValues>();
  const [values, setValues] = useState<DonationFormValues>({ ...defaultDonationValues });
  const [donorKind, setDonorKind] = useState<DonorKind>("Personnel");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const update = (k: keyof DonationFormValues) => (val: string) => setValues((v) => ({ ...v, [k]: val }));

  const canContinue = donorKind === "Entreprise"
    ? !!(values.companyName && values.companySiret && values.email)
    : !!(values.firstName && values.lastName && values.email);

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main className="app-container pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
      <div className="app-card mt-2">
        <div className="space-y-5">
          <div className="app-title">Informations personnelles</div>

          <SegmentedControl
            options={["Personnel", "Entreprise"]}
            value={donorKind}
            onChange={(v: string) => {
              const kind = (v as DonorKind);
              setDonorKind(kind);
              // sync schema field
              setValues((prev) => ({ ...prev, donorType: kind } as DonationFormValues));
            }}
          />

          {donorKind === "Entreprise" ? (
            <div className="grid gap-3">
              <Input placeholder="Raison sociale" value={values.companyName} onChange={(v) => { update("companyName")(v); form.setValue("companyName", v as string, { shouldDirty: true }); }} />
              <Input placeholder="SIRET" value={values.companySiret} onChange={(v) => { update("companySiret")(v); form.setValue("companySiret", v as string, { shouldDirty: true }); }} />
              <Input type="email" placeholder="Email" value={values.email} onChange={(v) => { update("email")(v); form.setValue("email", v as string, { shouldDirty: true }); }} />
              <Input placeholder="Adresse" value={values.address} onChange={(v) => { update("address")(v); form.setValue("address", v as string, { shouldDirty: true }); }} />
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2 md:gap-3">
                <Input placeholder="Prénom" value={values.firstName} onChange={(v) => { update("firstName")(v); form.setValue("firstName", v as string, { shouldDirty: true }); }} />
                <Input placeholder="Nom" value={values.lastName} onChange={(v) => { update("lastName")(v); form.setValue("lastName", v as string, { shouldDirty: true }); }} />
              </div>
              <Input type="email" placeholder="Email" value={values.email} onChange={(v) => { update("email")(v); form.setValue("email", v as string, { shouldDirty: true }); }} />
              <Input placeholder="Adresse" value={values.address} onChange={(v) => { update("address")(v); form.setValue("address", v as string, { shouldDirty: true }); }} />
            </div>
          )}

          <div className="section-box flex items-center justify-between">
            <span className="text-[15px]">Je souhaite recevoir un reçu fiscal</span>
            <Switch checked={values.wantsReceipt} onCheckedChange={(checked) => { setValues((v) => ({ ...v, wantsReceipt: !!checked })); form.setValue("wantsReceipt", !!checked, { shouldDirty: true }); }} />
          </div>

          <div className="mt-1 grid grid-cols-2 gap-3">
            <a href="/step-amount-v2" className="btn-secondary pressable w-full text-center py-3">← Retour</a>
            <button
              disabled={!canContinue}
              onClick={() => canContinue && router.push("/step-payment")}
              className="btn-primary pressable w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continuer →
            </button>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}

