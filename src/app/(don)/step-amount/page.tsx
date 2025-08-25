"use client";

import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight } from "lucide-react";
import { AppBar, Stepper, SegmentedControl, Input, InlineNote, SummaryRow, Slider, AmountDisplay, CollapsibleStepCard, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components/ui";
import { DonationFormValues } from "@/lib/schema";

export default function StepAmountPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isAmountOpen, setIsAmountOpen] = useState(true);
  const [canNavigateToNext, setCanNavigateToNext] = useState(false);
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const previousMosqueRef = useRef(values.mosqueName);

  // Surveiller le montant pour autoriser la navigation
  useEffect(() => {
    if (values.amount > 0 && values.mosqueName) {
      setCanNavigateToNext(true);
    } else {
      setCanNavigateToNext(false);
    }
  }, [values.amount, values.mosqueName]);

  const handleNext = () => {
    if (canNavigateToNext) {
      router.push("/step-personal");
    } else {
      // Si pas prêt, ouvrir la carte amount
      setIsAmountOpen(true);
    }
  };

  const handleAmountToggle = () => {
    setIsAmountOpen(!isAmountOpen);
  };

  const hasAmount = values.amount > 0;
  const hasPersonalInfo = Boolean(values.firstName && values.lastName && values.email);

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
        <div className="space-y-[14px]">
          <CollapsibleStepCard
            title="How much would you like to give?"
            summaryValue={hasAmount ? `€${values.amount}${values.frequency === "Weekly" ? "/week" : values.frequency === "Monthly" ? "/month" : ""}` : "Add"}
            isActive={isAmountOpen}
            isCompleted={hasAmount}
            delay={100}
            onClick={handleAmountToggle}
          >
            <div className="space-y-6">
              {/* Section fréquence */}
              <div className="space-y-4">
                <SegmentedControl
                  options={["One time", "Weekly", "Monthly"]}
                  value={values.frequency}
                  onChange={(v: string) => form.setValue("frequency", v as "One time" | "Weekly" | "Monthly", { shouldDirty: true })}
                />
              </div>

              {/* Section montant principal */}
              <div className="space-y-5">
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
              <div className="space-y-4">
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
                
                <InlineNote amount={values.amount} currency="€" frequency={values.frequency} />
              </div>
            </div>
          </CollapsibleStepCard>
          
          <CollapsibleStepCard
            title="Information"
            summaryValue={hasPersonalInfo ? `${values.firstName} ${values.lastName}` : "Add"}
            isActive={false}
            isCompleted={hasPersonalInfo}
            delay={200}
          >
            <div>Personal information form will appear here</div>
          </CollapsibleStepCard>
          
          <CollapsibleStepCard
            title="Payment"
            summaryValue="Add"
            isActive={false}
            isCompleted={false}
            delay={300}
          >
            <div>Payment form will appear here</div>
          </CollapsibleStepCard>
        </div>
        
        <div className="docked-actions">
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
              disabled={values.amount <= 0}
              className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}