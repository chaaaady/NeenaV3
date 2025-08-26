"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight } from "lucide-react";
import { AppBar, Stepper, SegmentedControl, Input, Slider, AmountDisplay, SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";

export default function StepAmountPage() {
  const form = useFormContext<DonationFormValues>();
  const _router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const { toPersonal, canProceedFromAmount } = useDonationFlow();

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      toPersonal();
    }
  };

  const handleReset = () => {
    form.reset();
    setOtherAmountInput("");
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
              <div className="app-title">Quel montant souhaites-tu donner ?</div>
              <Stepper 
                steps={[
                  { label: "Montant", status: "active" },
                  { label: "Info", status: "pending" },
                  { label: "Payment", status: "pending" }
                ]} 
              />
            </div>
            
            <div className="space-y-3">
              <SegmentedControl
                options={["One time", "Weekly", "Monthly"]}
                value={values.frequency}
                onChange={(v: string) => form.setValue("frequency", v as "One time" | "Weekly" | "Monthly", { shouldDirty: true })}
              />
              
              <AmountDisplay amount={values.amount} />
              <Slider
                value={values.amount}
                onChange={(v: number) => form.setValue("amount", v, { shouldDirty: true })}
                min={5}
                max={100}
                step={1}
              />
              
              <div className="space-y-3">
                <Input
                  value={otherAmountInput}
                  onChange={setOtherAmountInput}
                  placeholder="Autre montant (€)"
                  rightAccessory="€"
                />
                <div className="inline-note" role="note">
                  <span className="text-[14px] font-[700]">
                    Après déduction fiscale estimée: {formatEuro(values.amount * 0.34)}
                  </span>
                </div>
              </div>
              
              <SegmentedControl
                options={["Sadaqah", "Zakat"]}
                value={values.donationType}
                onChange={(v: string) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
              />
            </div>
            
            {/* Boutons d'actions intégrés dans la carte */}
            <div className="pt-6 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleReset}
                  className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
                <button
                  onClick={handleNext}
                  disabled={!values.amount || values.amount < 5}
                  className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}