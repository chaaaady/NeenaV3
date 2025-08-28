"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppBar, Stepper, Input, AmountDisplay, SideMenu, MosqueSelectorModal, SegmentedControl } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV2Page() {
  const form = useFormContext<DonationFormValues>();
  const _router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const { toPersonal, canProceedFromAmount } = useDonationFlow();
  const isInvalidAmount = !!otherAmountInput && isNaN(parseFloat(otherAmountInput));

  // Animation d'intro discrète
  useEffect(() => {
    if (!values.amount || values.amount === 50) {
      form.setValue("amount", 25, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePresetClick = (amt: number) => {
    form.setValue("amount", amt, { shouldDirty: true });
    setOtherAmountInput("");
  };

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

  const isActive = (amt: number) => values.amount === amt && otherAmountInput.trim() === "";

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

            <div className="space-y-5">
              <SegmentedControl
                options={["Unique", "Vendredi", "Mensuel"]}
                value={values.frequency}
                onChange={(v: string) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
              />

              <div className="amount-grid mt-5" role="group" aria-label="Sélection du montant">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    className={`segmented-option ${isActive(amt) ? "active" : ""}`}
                    aria-pressed={isActive(amt)}
                    onClick={() => handlePresetClick(amt)}
                    style={{ height: 44 }}
                  >
                    {amt} €
                  </button>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input
                    value={otherAmountInput}
                    onChange={handleOtherAmountChange}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Autre montant"
                    rightAccessory="€"
                    ariaInvalid={isInvalidAmount}
                    onEnter={() => {
                      if (!isInvalidAmount) {
                        // Blur pour refermer le clavier et revenir au layout normal
                        const active = document.activeElement as HTMLElement | null;
                        active?.blur();
                      }
                    }}
                    onBlur={() => {
                      // Nettoyage de l'entrée si invalide
                      const num = parseFloat(otherAmountInput);
                      if (isNaN(num)) {
                        setOtherAmountInput("");
                      }
                    }}
                  />
                  {isInvalidAmount && (
                    <div className="text-[13px] text-red-600 mt-1">Veuillez entrer un nombre valide</div>
                  )}
                </div>
              </div>

              {/* Type de don sous la sélection de montant */}
              <SegmentedControl
                options={["Sadaqah", "Zakat"]}
                value={values.donationType}
                onChange={(v: string) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
              />

              <div className="amount-grid-footer text-[15px] text-[var(--text)] mt-2 leading-snug" aria-live="polite">
                Votre don de {formatEuro(values.amount)}{values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}{" "}
                ne vous coûtera que <span className="font-[700]">{formatEuro(values.amount * 0.34)}{values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}</span>{" "}
                après déduction fiscale.
              </div>
            </div>

            <div className="pt-0">
              <div className="flex items-center justify-end sm:justify-end">
                <button
                  onClick={handleNext}
                  disabled={!values.amount || isNaN(values.amount as any)}
                  className="btn-primary pressable px-10 py-3 text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-1/2"
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

