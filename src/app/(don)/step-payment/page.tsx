"use client";

import { useState, useRef, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppBar, Input, SideMenu, MosqueSelectorModal } from "@/components";
import { Switch } from "@/components/Switch";
import { ApplePayButton } from "@/components/ApplePayButton";
import { PayPalButton } from "@/components/PayPalButton";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";
import { formatEuro } from "@/lib/currency";
import { buildDonationSummary } from "@/features/donation/summary";
import { Receipt, CreditCard, Calendar, Shield } from "lucide-react";

export default function StepPaymentPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const donateBtnRef = useRef<HTMLButtonElement>(null);

  const summarySentence = useMemo(() => buildDonationSummary(values), [values]);

  const handleSubmit = () => {
    // Logique de soumission du paiement
    console.log("Paiement soumis:", values);
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
        {/* Récapitulatif sur fond blanc (esthétique améliorée) */}
        <div className="app-card mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-soft)] flex-shrink-0">
                <Receipt size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-[var(--text-muted)]">Récapitulatif</div>
                <div className="text-[15px] text-[var(--text)] leading-relaxed whitespace-normal break-words">{summarySentence}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale pour le paiement */}
        <div className="app-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="app-title">
                Paiement sécurisé pour la{" "}
                <button
                  onClick={() => setShowMosqueSelector(true)}
                  className="mosque-title-link"
                >
                  mosquée de {values.mosqueName || "Sélectionner"}
                </button>
              </div>
            </div>

            {/* Section carte bancaire et autres paiements */}
            <div className="section-box space-y-2">
              <Input
                value={values.cardNumber}
                onChange={(v: string) => form.setValue("cardNumber", v, { shouldDirty: true })}
                autoComplete="cc-number"
                leftIcon={<CreditCard size={18} />}
                placeholder="Numéro de carte"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={values.cardExp}
                  onChange={(v: string) => form.setValue("cardExp", v, { shouldDirty: true })}
                  placeholder="MM/AA"
                  leftIcon={<Calendar size={18} />}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <Input
                  value={values.cardCvc}
                  onChange={(v: string) => form.setValue("cardCvc", v, { shouldDirty: true })}
                  placeholder="CVC"
                  leftIcon={<Shield size={18} />}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <ApplePayButton />
                <PayPalButton label="PayPal" variant="brand" />
              </div>
            </div>

            {/* Couvrir les frais */}
            <div className="section-box">
              <div className="flex items-center justify-between gap-3">
                <span className="flex-1 text-[14px] leading-snug text-[var(--text)] font-[500]">Je rajoute {formatEuro(values.amount * 0.029)} pour que 100% de mon don aille à la mosquée</span>
                <Switch
                  checked={values.coverFees}
                  onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
                  ariaLabel="Couvrir les frais"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-0">
              <div className="grid grid-cols-2 gap-3"> {/* Changed to grid for Retour button */}
                <button
                  onClick={() => router.push("/step-personal-v2")} // Navigate back to personal V2
                  className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  data-variant="success"
                  ref={donateBtnRef}
                  className="btn-primary pressable w-full text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: '#15803D' }}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}