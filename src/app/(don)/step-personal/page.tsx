"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, CreditCard } from "lucide-react";
import { AppBar, Stepper, SegmentedControl, Input, Checkbox, SideMenu, MosqueSelectorModal } from "@/components";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";

export default function StepPersonalPage() {
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

  return (
    <>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="app-title">Personal Information</div>
              <Stepper 
                steps={[
                  { label: "Montant", status: "completed" },
                  { label: "Info", status: "active" },
                  { label: "Payment", status: "pending" }
                ]} 
              />
            </div>
            
            <div className="space-y-3">
              <SegmentedControl
                options={["Personnel", "En hommage", "Entreprise"]}
                value={values.donorType}
                onChange={(v: string) => form.setValue("donorType", v as "Personnel" | "En hommage" | "Entreprise", { shouldDirty: true })}
              />
              
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
              
              <Input
                value={values.email}
                onChange={(v: string) => form.setValue("email", v, { shouldDirty: true })}
                placeholder="Email"
                type="email"
              />
              
              {values.donorType === "Entreprise" && (
                <Input
                  value={values.companyName}
                  onChange={(v: string) => form.setValue("companyName", v, { shouldDirty: true })}
                  placeholder="Nom de l'entreprise"
                />
              )}
              
              {values.donorType === "En hommage" && (
                <Input
                  value={values.tributeName}
                  onChange={(v: string) => form.setValue("tributeName", v, { shouldDirty: true })}
                  placeholder="Nom de la personne"
                />
              )}
              
              <Checkbox
                label="Je souhaite recevoir un reçu fiscal par email"
                checked={values.wantsReceipt}
                onChange={(v: boolean) => form.setValue("wantsReceipt", v, { shouldDirty: true })}
              />
            </div>
            
            {/* Boutons d'actions intégrés dans la carte */}
            <div className="pt-6 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/step-amount")}
                  className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!values.firstName || !values.lastName || !values.email}
                  className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Payment
                  <CreditCard size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}