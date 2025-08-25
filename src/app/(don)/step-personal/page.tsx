"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight, CreditCard } from "lucide-react";
import { AppBar, Stepper, Input, Checkbox, SummaryRow, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components/ui";
import { DonationFormValues } from "@/lib/schema";

export default function StepPersonalPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);

  const handleNext = () => {
    if (values.firstName && values.lastName && values.email) {
      router.push("/step-payment");
    }
  };

  const hasAmount = values.amount > 0;
  const hasPersonalInfo = Boolean(values.firstName && values.lastName && values.email);
  const hasPaymentInfo = Boolean(values.cardNumber && values.cardExp && values.cardCvc);

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
      <Stepper activeStep={1} />
      <div className="app-container">
        {/* Carte principale Personal Information */}
        <div className="app-card">
          <div className="space-y-4">
            <div className="app-title line-clamp-2">Personal Information</div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={values.firstName}
                  onChange={(v: string) => form.setValue("firstName", v, { shouldDirty: true })}
                  autoComplete="given-name"
                />
                <Input
                  label="Last Name"
                  value={values.lastName}
                  onChange={(v: string) => form.setValue("lastName", v, { shouldDirty: true })}
                  autoComplete="family-name"
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