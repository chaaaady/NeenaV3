"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AppBar, Input, SideMenu, MosqueSelectorModal, SegmentedControl, Checkbox } from "@/components";
import { DonationFormValues } from "@/lib/schema";
import { User, Building2, Mail, MapPin, CreditCard } from "lucide-react";

export default function StepPersonalPage() {
  const form = useFormContext<DonationFormValues>();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);

  const handleNext = () => {
    // Logique de navigation vers la page de paiement
    console.warn("Navigation vers paiement");
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
              <div className="app-title">Informations personnelles</div>
            </div>
            
            <div className="space-y-3">
              <SegmentedControl
                options={["Personnel", "En hommage", "Entreprise"]}
                value={values.donorType}
                onChange={(v: string) => form.setValue("donorType", v as "Personnel" | "En hommage" | "Entreprise", { shouldDirty: true })}
              />
              
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
                  />
                </>
              ) : (
                <>
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
                  
                  {values.donorType === "En hommage" && (
                    <Input
                      value={values.tributeName}
                      onChange={(v: string) => form.setValue("tributeName", v, { shouldDirty: true })}
                      placeholder="Au nom de"
                    />
                  )}
                </>
              )}
              
              <div className="flex items-center gap-3">
                <Checkbox
                  label="Je souhaite recevoir un reçu fiscal"
                  checked={values.wantsReceipt}
                  onChange={(checked: boolean) => form.setValue("wantsReceipt", checked, { shouldDirty: true })}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={handleNext}
                disabled={
                  values.donorType === "Entreprise" 
                    ? (!values.companyName || !values.companySiret || !values.email)
                    : (!values.firstName || !values.lastName || !values.email)
                }
                className="btn-primary pressable w-full px-10 py-3 text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuer
                <CreditCard size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}