"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DonationFormValues, defaultDonationValues } from "@/lib/schema";
import { AppBar, SideMenu, Input, SegmentedControl, Switch } from "@/components";

type DonorKind = "Personnel" | "Entreprise";

export default function Page() {
  const router = useRouter();
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
              <Input placeholder="Raison sociale" value={values.companyName} onChange={update("companyName")} />
              <Input placeholder="SIRET" value={values.companySiret} onChange={update("companySiret")} />
              <Input type="email" placeholder="Email" value={values.email} onChange={update("email")} />
              <Input placeholder="Adresse" value={values.address} onChange={update("address")} />
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2 md:gap-3">
                <Input placeholder="Prénom" value={values.firstName} onChange={update("firstName")} />
                <Input placeholder="Nom" value={values.lastName} onChange={update("lastName")} />
              </div>
              <Input type="email" placeholder="Email" value={values.email} onChange={update("email")} />
              <Input placeholder="Adresse" value={values.address} onChange={update("address")} />
            </div>
          )}

          <div className="section-box flex items-center justify-between">
            <span className="text-[15px]">Je souhaite recevoir un reçu fiscal</span>
            <Switch checked={values.wantsReceipt} onCheckedChange={(checked) => setValues((v) => ({ ...v, wantsReceipt: !!checked }))} />
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

