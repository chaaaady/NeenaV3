"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AppBar, Stepper, SegmentedControl, Input, Slider, AmountDisplay, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components/ui";
import { DonationFormValues } from "@/lib/schema";

export default function StepAmountPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);

  const handleNext = () => {
    if (values.amount > 0 && values.mosqueName) {
      router.push("/step-personal");
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
      <Stepper activeStep={0} />
      <div className="app-container">
        {/* Carte principale Amount */}
        <div className="app-card">
          <div className="space-y-4">
            <div className="app-title line-clamp-2">How much would you like to give?</div>
            
            {/* Section fréquence */}
            <SegmentedControl
              options={["One time", "Weekly", "Monthly"]}
              value={values.frequency}
              onChange={(v: string) => form.setValue("frequency", v as "One time" | "Weekly" | "Monthly", { shouldDirty: true })}
            />

            {/* Section montant principal */}
            <div className="space-y-3">
              <AmountDisplay currency="€" amount={values.amount} frequency={values.frequency} />
              
              <Slider
                min={5}
                max={100}
                step={1}
                value={values.amount}
                onChange={(v: number) => form.setValue("amount", v, { shouldDirty: true })}
              />
            </div>

            {/* Section montant personnalisé */}
            <div className="space-y-3">
              <Input
                label="Other Amount"
                value={otherAmountInput}
                onChange={(v: string) => {
                  setOtherAmountInput(v);
                  const num = parseFloat(v);
                  if (!isNaN(num) && num >= 0) {
                    form.setValue("amount", num, { shouldDirty: true });
                  }
                }}
                placeholder="€ Enter your donation amount here"
                rightAccessory="€"
              />
              
              <div className="inline-note" role="note">
                <span className="text-[14px] font-[700]">Your donation only costs you €{Math.round(values.amount * 0.34)} after tax deduction.</span>
              </div>

              {/* Donation type moved under note */}
              <div className="space-y-2">
                <div className="text-[14px] font-[700] text-[var(--text-muted)]">Donation type</div>
                <SegmentedControl
                  options={["Sadaqah", "Zakat"]}
                  value={values.donationType}
                  onChange={(v: string) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
        
      <div className="docked-actions">
        <div className="container">
          <div className="grid gap-3">
            <button
              onClick={() => form.reset()}
              className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button
              onClick={handleNext}
              disabled={values.amount <= 0 || !values.mosqueName}
              className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Espaceur pour la barre Safari */}
      <div className="safari-spacer"></div>
    </>
  );
}