"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight, CreditCard } from "lucide-react";
import { AppBar, Stepper, Input, Checkbox, SummaryRow, CollapsibleStepCard, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components/ui";
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
        <div className="space-y-[14px]">
          <CollapsibleStepCard
            title="How much would you like to give?"
            summaryValue={hasAmount ? `€${values.amount}${values.frequency === "Weekly" ? "/week" : values.frequency === "Monthly" ? "/month" : ""}` : "Add"}
            isActive={false}
            isCompleted={hasAmount}
            delay={100}
          >
            <div>Amount form (collapsed)</div>
          </CollapsibleStepCard>
          
          <CollapsibleStepCard
            title="Personal Information"
            summaryValue={hasPersonalInfo ? `${values.firstName} ${values.lastName}` : "Add"}
            isActive={true}
            isCompleted={hasPersonalInfo}
            delay={200}
          >
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
          </CollapsibleStepCard>
          
          <CollapsibleStepCard
            title="Payment"
            summaryValue={hasPaymentInfo ? "Card ending ****" : "Add"}
            isActive={false}
            isCompleted={hasPaymentInfo}
            delay={300}
          >
            <div>Payment form will appear here</div>
          </CollapsibleStepCard>
        </div>
        
        <div className="docked-actions">
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
    </>
  );
}