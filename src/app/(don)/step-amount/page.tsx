"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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

  // Vérifier si un montant personnalisé est saisi
  const hasCustomAmount = otherAmountInput.trim() !== "" && !isNaN(parseFloat(otherAmountInput));

  // Initialiser le montant à 0€ puis animer vers 25€ (calm-tech, court)
  useEffect(() => {
    // éviter la dépendance à form/values pour ne pas réanimer
    if (!values.amount || values.amount === 50) {
      form.setValue("amount", 0, { shouldDirty: true });
      const t = setTimeout(() => {
        form.setValue("amount", 25, { shouldDirty: true });
      }, 600);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gérer le changement de l'input "Autre montant"
  const handleOtherAmountChange = (value: string) => {
    setOtherAmountInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      form.setValue("amount", numValue, { shouldDirty: true });
    }
  };

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      toPersonal();
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="app-title">Quel montant souhaitez-vous donner ?</div>
            </div>
            
            <div className="space-y-3">
              <SegmentedControl
                options={["Unique", "Vendredi", "Mensuel"]}
                value={values.frequency}
                onChange={(v: string) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
              />
            </div>
            
            <div className="space-y-5">
              <div className="my-5">
                <AmountDisplay amount={values.amount} frequency={values.frequency} />
              </div>
              <Slider
                value={values.amount}
                onChange={(v: number) => {
                  form.setValue("amount", v, { shouldDirty: true });
                }}
                min={5}
                max={100}
                step={1}
                hideLandmarks={hasCustomAmount}
              />
              
              <div className="space-y-3">
                <Input
                  value={otherAmountInput}
                  onChange={handleOtherAmountChange}
                  type="number"
                  inputMode="numeric"
                  placeholder="Autre montant"
                  rightAccessory="€"
                />
                <div className="text-[14px] text-[var(--text-muted)]">
                  Après déduction fiscale, votre don ne vous coûtera que {formatEuro(Math.max(0, values.amount - values.amount * 0.34))}
                </div>
              </div>
              
              <SegmentedControl
                options={["Sadaqah", "Zakat", "Special"]}
                value={values.donationType}
                onChange={(v: string) => {
                  form.setValue("donationType", v as "Sadaqah" | "Zakat" | "Special", { shouldDirty: true });
                  if (v !== "Special") {
                    form.setValue("specialDonation", null, { shouldDirty: true });
                  }
                }}
              />

              {values.donationType === "Special" && (
                <div className="space-y-3">
                  <div className="segmented-track" style={{ flexWrap: 'wrap' as const }}>
                    {["Zakat al-fitr","Sadaqa Jâriya","Waqf","Kaffâra / Fidyah","Aqîqa","Udh’hiya","Frais scolaire"].map((label) => (
                      <button
                        key={label}
                        className={`segmented-option ${values.specialDonation === label ? "active" : ""}`}
                        onClick={() => form.setValue("specialDonation", label, { shouldDirty: true })}
                        style={{ flex: '0 1 calc(33.333% - 8px)' }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bouton d'action et stepper en bas */}
            <div className="pt-4">
              <div className="flex items-center justify-between">
                <Stepper 
                  steps={[
                    { label: "Montant", status: "active" },
                    { label: "Info", status: "pending" },
                    { label: "Payment", status: "pending" }
                  ]} 
                />
                <button
                  onClick={handleNext}
                  disabled={!values.amount || values.amount < 5}
                  className="btn-primary pressable px-10 py-3 text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-1/2"
                >
                  Suivant
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