"use client";

import { useState, useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppBar, Input, SideMenu, MosqueSelectorModal, SegmentedControl } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV3Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const { canProceedFromAmount } = useDonationFlow();

  useEffect(() => {
    if (!values.amount) {
      form.setValue("amount", 25, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInvalidAmount = !!otherAmountInput && isNaN(parseFloat(otherAmountInput));

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

  const hero = useMemo(() => {
    const amountStr = formatEuro(values.amount || 0);
    const suffix = values.frequency === "Vendredi" ? "/semaine" : values.frequency === "Mensuel" ? "/mois" : "";
    return (
      <div className="text-center">
        <div className="amount-display">
          <span className="amount-value">{amountStr.replace("€", "")}</span>
          <span className="amount-currency">€</span>
          {suffix && <span className="amount-suffix">{suffix}</span>}
        </div>
        <div className="mt-1 text-[12px] uppercase tracking-wide">
          <button onClick={() => setShowMosqueSelector(true)} className="mosque-title-link">Mosquée de {values.mosqueName || "Sélectionner"}</button>
        </div>
      </div>
    );
  }, [values.amount, values.frequency, values.mosqueName]);

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      router.push("/step-personal-v3");
    }
  };

  const isActive = (amt: number) => values.amount === amt && otherAmountInput.trim() === "";

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />
      <div className="app-container">
        <div className="app-card">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="app-title">Montant du don</div>
            </div>

            {hero}

            <div className="space-y-4">
              <SegmentedControl
                options={["Unique", "Vendredi", "Mensuel"]}
                value={values.frequency}
                onChange={(v: string) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
              />

              <div className="amount-grid" role="group" aria-label="Sélection du montant">
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
                  />
                  {isInvalidAmount && (
                    <div className="text-[13px] text-red-600 mt-1">Veuillez entrer un nombre valide</div>
                  )}
                </div>
              </div>

              <SegmentedControl
                options={["Sadaqah", "Zakat"]}
                value={values.donationType}
                onChange={(v: string) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
              />
            </div>
          </div>
        </div>

        <div className="docked-actions dock-minimal">
          <div className="container">
            <button
              onClick={handleNext}
              disabled={!(typeof values.amount === "number" && Number.isFinite(values.amount) && values.amount > 0)}
              className="btn-primary pressable w-full"
            >
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

