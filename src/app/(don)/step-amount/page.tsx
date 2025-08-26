"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight } from "lucide-react";
import { AppBar, Stepper, SegmentedControl, Input, Slider, AmountDisplay, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components";
import { LayoutNoScroll, ProgressHeader } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";

export default function StepAmountPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
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



  return (
    <>
      <LayoutNoScroll title="Neena" onMenu={() => setIsMenuOpen(true)}>
      <div className="app-container">
        <ProgressHeader current={1} total={3} />
        <div className="app-card">
          <div className="space-y-3">
            <div className="app-title">Quel montant souhaites-tu donner ?</div>
            <div className="text-[15px] leading-[22px] text-[var(--text-muted)]">Estimation indicative, selon votre situation fiscale.</div>
          </div>
        </div>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />
        <div className="app-card">
          <div className="space-y-4">
            <div className="card-title">Fréquence</div>
            <SegmentedControl
              options={["Ponctuel", "Hebdo", "Mensuel"]}
              value={values.frequency}
              onChange={(v: string) => form.setValue("frequency", v as "One time" | "Weekly" | "Monthly", { shouldDirty: true })}
            />

            <div className="card-title">Montant</div>
            <div className="space-y-3">
              <AmountDisplay currency="€" amount={values.amount} frequency={values.frequency} />
              <div className="grid grid-cols-4 gap-2">
                {[5,25,50,100].map(p => (
                  <button key={p} onClick={() => form.setValue("amount", p, { shouldDirty: true })} className="chip">
                    € {p}
                  </button>
                ))}
              </div>
              
              <Slider
                min={5}
                max={100}
                step={1}
                value={values.amount}
                onChange={(v: number) => form.setValue("amount", v, { shouldDirty: true })}
              />
            </div>

            <div className="space-y-3">
              <Input
                label="Autre montant"
                value={otherAmountInput}
                onChange={(v: string) => {
                  setOtherAmountInput(v);
                  const num = parseFloat(v);
                  if (!isNaN(num) && num >= 0) {
                    form.setValue("amount", num, { shouldDirty: true });
                  }
                }}
                placeholder="€ Entrez votre montant"
                rightAccessory="€"
              />
              
              <div className="inline-note" role="note">
                <span className="text-[14px] font-[700]">Après déduction fiscale estimée: {formatEuro(Math.round(values.amount * 0.34))}</span>
              </div>

              {/* Donation type moved under note */}
              <div className="space-y-2">
                <div className="text-[14px] font-[700] text-[var(--text-muted)]">Type de don</div>
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
      </LayoutNoScroll>
      
      {/* Espaceur pour la barre Safari */}
      <div className="safari-spacer"></div>
    </>
  );
}