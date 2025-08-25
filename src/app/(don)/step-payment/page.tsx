"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight, CreditCard, Heart } from "lucide-react";
import { AppBar, Stepper, Input, Checkbox, SummaryRow, PayPalButton, CollapsibleStepCard, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components/ui";
import { DonationFormValues } from "@/lib/schema";
import { Calendar, Shield } from "lucide-react";

export default function StepPaymentPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);

  const handleSubmit = () => {
    // Handle payment submission
    console.log("Payment submitted", values);
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
      <Stepper activeStep={2} />
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
            isActive={false}
            isCompleted={hasPersonalInfo}
            delay={200}
          >
            <div>Personal information form (collapsed)</div>
          </CollapsibleStepCard>
          
          <CollapsibleStepCard
            title="Payment Method"
            summaryValue={hasPaymentInfo ? "Card ending ****" : "Add"}
            isActive={true}
            isCompleted={hasPaymentInfo}
            delay={300}
          >
            <div className="space-y-[14px]">
              <Input
                label="Card Number"
                value={values.cardNumber}
                onChange={(v: string) => form.setValue("cardNumber", v, { shouldDirty: true })}
                autoComplete="cc-number"
                leftIcon={<CreditCard size={18} />}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Expiry"
                  value={values.cardExp}
                  onChange={(v: string) => form.setValue("cardExp", v, { shouldDirty: true })}
                  placeholder="MM/YY"
                  leftIcon={<Calendar size={18} />}
                />
                <Input
                  label="CVC"
                  value={values.cardCvc}
                  onChange={(v: string) => form.setValue("cardCvc", v, { shouldDirty: true })}
                  placeholder="3 digits"
                  leftIcon={<Shield size={18} />}
                />
              </div>
              
              <div className="h-[1px] bg-[var(--border)]"></div>
              <div className="text-[13px] text-[var(--text-muted)]">Others</div>
              
              <PayPalButton label="Pay Pal" />
              
              <Checkbox
                label="I'd like to add €0.62 to cover the bank fees so 100% of my donation goes to the mosque."
                checked={values.coverFees}
                onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
              />
            </div>
          </CollapsibleStepCard>
        </div>
        
        <div className="docked-actions">
          <div className="grid gap-3">
            <button
              onClick={() => router.push("/step-personal")}
              className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Back
            </button>
            <button
              onClick={handleSubmit}
              data-variant="success"
              className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Donate €{values.amount}
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}