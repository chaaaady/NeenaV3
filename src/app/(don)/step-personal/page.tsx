"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, CreditCard } from "lucide-react";
import { AppBar, Stepper, Input, Checkbox, SideMenu, ProductHeader, MosqueSelectorModal, SegmentedControl } from "@/components";
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
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <ProductHeader 
        currentMosque={values.mosqueName}
        onMosqueSelect={() => setShowMosqueSelector(true)}
        onInfoNavigation={() => window.open('https://neena.fr', '_blank')}
      />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />
      <Stepper 
        steps={[
          { label: "Montant", status: "completed" },
          { label: "Info", status: "active" },
          { label: "Payment", status: "pending" }
        ]} 
      />
      <div className="app-container">
        <div className="app-card">
          <div className="space-y-4">
            <div className="app-title">Personal Information</div>
            
            <div className="space-y-3">
              {/* Donor type selector */}
              <div className="space-y-2">
                <div className="text-[14px] font-[700] text-[var(--text-muted)]">Donor type</div>
                <SegmentedControl
                  options={["Personal", "In honor of", "Company"]}
                  value={values.donorType}
                  onChange={(v: string) => form.setValue("donorType", v as "Personal" | "In honor of" | "Company", { shouldDirty: true })}
                />
              </div>
              {values.donorType === "In honor of" && (
                <Input
                  label="In honor of"
                  value={values.tributeName}
                  onChange={(v: string) => form.setValue("tributeName", v, { shouldDirty: true })}
                  placeholder="Name of a relative or loved one"
                />
              )}
              {values.donorType === "Company" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Company Name"
                      value={values.companyName}
                      onChange={(v: string) => form.setValue("companyName", v, { shouldDirty: true })}
                      placeholder="Registered company name"
                    />
                    <Input
                      label="Company SIRET"
                      value={values.companySiret}
                      onChange={(v: string) => form.setValue("companySiret", v, { shouldDirty: true })}
                      placeholder="14-digit SIRET"
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={(v: string) => form.setValue("email", v, { shouldDirty: true })}
                    autoComplete="email"
                  />
                  <Input
                    label="Address"
                    value={values.address}
                    onChange={(v: string) => form.setValue("address", v, { shouldDirty: true })}
                    autoComplete="street-address"
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label={values.donorType === "In honor of" ? "Your First Name" : "First Name"}
                      value={values.firstName}
                      onChange={(v: string) => form.setValue("firstName", v, { shouldDirty: true })}
                      autoComplete="given-name"
                    />
                    <Input
                      label={values.donorType === "In honor of" ? "Your Last Name" : "Last Name"}
                      value={values.lastName}
                      onChange={(v: string) => form.setValue("lastName", v, { shouldDirty: true })}
                      autoComplete="family-name"
                    />
                  </div>
                  <Input
                    label={values.donorType === "In honor of" ? "Your Email" : "Email"}
                    type="email"
                    value={values.email}
                    onChange={(v: string) => form.setValue("email", v, { shouldDirty: true })}
                    autoComplete="email"
                  />
                  <Input
                    label={values.donorType === "In honor of" ? "Your Address" : "Address"}
                    value={values.address}
                    onChange={(v: string) => form.setValue("address", v, { shouldDirty: true })}
                    autoComplete="street-address"
                  />
                </>
              )}
              <Checkbox
                label="Please indicate if you would like to receive a tax receipt to use when filing your tax return."
                checked={values.wantsReceipt}
                onChange={(v: boolean) => form.setValue("wantsReceipt", v, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </div>
        
      <div className="docked-actions">
        <div className="container">
          <div className="grid gap-3">
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
      
      {/* Espaceur pour la barre Safari */}
      <div className="safari-spacer"></div>
    </>
  );
}