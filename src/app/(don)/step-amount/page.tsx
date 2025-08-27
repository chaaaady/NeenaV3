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
  const [otherAmountInput, setOtherAmountInput] = useState("25");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const { toPersonal, canProceedFromAmount } = useDonationFlow();

  // Initialiser le montant à 25€ si pas encore défini
  useEffect(() => {
    if (!values.amount || values.amount === 50) {
      form.setValue("amount", 25, { shouldDirty: true });
    }
  }, []);

  // Calculer le pourcentage pour le slider basé sur la valeur actuelle
  const getSliderPercent = (amount: number) => {
    if (amount <= 5) return 0;
    if (amount >= 100) return 100;
    return ((amount - 5) / (100 - 5)) * 100;
  };

  // Gérer le changement de l'input "Autre montant"
  const handleOtherAmountChange = (value: string) => {
    setOtherAmountInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      form.setValue("amount", numValue, { shouldDirty: true });
    }
  };

  // Synchroniser l'input avec la valeur du formulaire
  useEffect(() => {
    if (values.amount && otherAmountInput !== values.amount.toString()) {
      setOtherAmountInput(values.amount.toString());
    }
  }, [values.amount, otherAmountInput]);

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
                options={["Unique", "Hebdomadaire", "Mensuel"]}
                value={values.frequency}
                onChange={(v: string) => form.setValue("frequency", v as "Unique" | "Hebdomadaire" | "Mensuel", { shouldDirty: true })}
              />
              
              <AmountDisplay amount={values.amount} />
              <Slider
                value={values.amount}
                onChange={(v: number) => {
                  form.setValue("amount", v, { shouldDirty: true });
                  setOtherAmountInput(v.toString());
                }}
                min={5}
                max={100}
                step={1}
              />
              
              <div className="space-y-3">
                <Input
                  value={otherAmountInput}
                  onChange={handleOtherAmountChange}
                  placeholder="Autre montant (€)"
                  rightAccessory="€"
                />
                <div className="text-[14px] text-[var(--text-muted)]">
                  Après déduction fiscale estimée: {formatEuro(values.amount * 0.34)}
                </div>
              </div>
              
              <SegmentedControl
                options={["Sadaqah", "Zakat"]}
                value={values.donationType}
                onChange={(v: string) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
              />
            </div>
            
            {/* Bouton d'action intégré dans la carte */}
            <div className="pt-6 border-t border-[var(--border)]">
              <button
                onClick={handleNext}
                disabled={!values.amount || values.amount < 5}
                className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Suivant
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}