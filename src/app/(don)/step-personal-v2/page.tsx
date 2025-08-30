"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { AppBar, SegmentedControl, Input, SideMenu, MosqueSelectorModal } from "@/components";
import { Switch } from "@/components/Switch";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";

export default function StepPersonalV2Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const { toPayment, canProceedFromPersonal } = useDonationFlow();

  const handleNext = () => {
    if (canProceedFromPersonal(values)) {
      toPayment();
    }
  };


  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <AppBar 
        onMenu={() => setIsMenuOpen(true)} 
        currentMosque={values.mosqueName}
        onMosqueSelect={() => setShowMosqueSelector(true)}
      />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />
      <div className="app-container">
        <div className="app-card">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="app-title">Informations personnelles</div>
            </div>

            <div className="space-y-5">
              {/* 1) Choix Personnel / Entreprise (mêmes règles visuelles que Frequency) */}
              <SegmentedControl
                options={["Personnel", "Entreprise"]}
                value={values.donorType === "Entreprise" ? "Entreprise" : "Personnel"}
                onChange={(v: string) => {
                  const mapped = v === "Entreprise" ? "Entreprise" : "Personnel";
                  form.setValue("donorType", mapped as "Personnel" | "Entreprise", { shouldDirty: true });
                }}
              />

              {/* 2) Champs d'informations */}
              <div className="section-box space-y-3">
                {values.donorType === "Entreprise" ? (
                  <>
                    <Input
                      value={values.companyName}
                      onChange={(v: string) => form.setValue("companyName", v, { shouldDirty: true })}
                      placeholder="Raison sociale"
                    />
                    <Input
                      value={values.companySiret}
                      onChange={(v: string) => form.setValue("companySiret", v, { shouldDirty: true })}
                      placeholder="SIRET"
                      inputMode="numeric"
                    />
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={values.firstName}
                      onChange={(v: string) => form.setValue("firstName", v, { shouldDirty: true })}
                      placeholder="Prénom"
                    />
                    <Input
                      value={values.lastName}
                      onChange={(v: string) => form.setValue("lastName", v, { shouldDirty: true })}
                      placeholder="Nom"
                    />
                  </div>
                )}

                <Input
                  value={values.email}
                  onChange={(v: string) => form.setValue("email", v, { shouldDirty: true })}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                />
                <Input
                  value={values.address || ""}
                  onChange={(v: string) => form.setValue("address", v, { shouldDirty: true })}
                  placeholder="Adresse"
                />
              </div>

              {/* 3) Reçu fiscal */}
              <div className="section-box">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex-1 text-[14px] leading-snug text-[var(--text)] font-[500]">Je souhaite recevoir un reçu fiscal</span>
                  <Switch
                    checked={values.wantsReceipt}
                    onChange={(v: boolean) => form.setValue("wantsReceipt", v, { shouldDirty: true })}
                    ariaLabel="Recevoir un reçu fiscal"
                  />
                </div>
              </div>

              <div className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(() => router.push("/step-amount-v2"), 240);
                    }}
                    className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </button>
                  <button
                    onClick={() => {
                      if (canProceedFromPersonal(values)) {
                        setIsVisible(false);
                        setTimeout(() => toPayment(), 240);
                      }
                    }}
                    disabled={
                      values.donorType === "Entreprise" 
                        ? (!values.companyName || !values.companySiret || !values.email)
                        : (!values.firstName || !values.lastName || !values.email)
                    }
                    className="btn-primary pressable w-full px-10 py-3 text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continuer
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

