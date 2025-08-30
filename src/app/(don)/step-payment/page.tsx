"use client";

import { useState, useRef, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AppBar, Input, SideMenu, MosqueSelectorModal } from "@/components";
import { Switch } from "@/components/Switch";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";
import { formatEuro } from "@/lib/currency";
import { buildDonationSummary } from "@/features/donation/summary";
import { Receipt, CreditCard, Calendar, Shield, Apple } from "lucide-react";

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

  // Fonction pour afficher le montant avec la fréquence
  const getAmountDisplay = () => {
    const amount = formatEuro(values.amount);
    if (values.frequency === "Vendredi" || values.frequency === "Mensuel") {
      return (
        <div className="text-center">
          <div className="text-[32px] font-[700] text-[var(--text)]">{amount}</div>
          <div className="text-[14px] text-[var(--text-muted)] mt-1">
            {values.frequency === "Vendredi" ? "/semaine" : "/mois"}
          </div>
        </div>
      );
    }
    return (
      <div className="text-center">
        <div className="text-[32px] font-[700] text-[var(--text)]">{amount}</div>
      </div>
    );
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
        {/* Récapitulatif avec montant en gros */}
        <div className="app-card mb-3">
          <div className="space-y-4">
            <div className="text-[13px] text-[var(--text-muted)] text-center">Mosquée de {values.mosqueName}</div>
            {getAmountDisplay()}
          </div>
        </div>

        {/* Couvrir les frais - section indépendante */}
        <div className="app-card mb-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex-1 text-[14px] leading-snug text-[var(--text)] font-[500]">Je rajoute {formatEuro(values.amount * 0.029)} pour que 100% de mon don aille à la mosquée</span>
            <Switch
              checked={values.coverFees}
              onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
              ariaLabel="Couvrir les frais"
            />
          </div>
        </div>

        {/* Carte principale pour le paiement */}
        <div className="app-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="app-title">
                Paiement sécurisé
              </div>
            </div>

            {/* Section carte bancaire */}
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
            </div>

            {/* Bouton Valider en pleine largeur */}
            <div className="pt-0">
              <button
                onClick={handleSubmit}
                data-variant="success"
                ref={donateBtnRef}
                className="btn-primary pressable w-full text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3"
                style={{ background: '#15803D' }}
              >
                <CreditCard size={18} />
                Valider
              </button>
            </div>

            {/* Options de paiement alternatives */}
            <div className="space-y-2">
              <div className="text-[13px] text-[var(--text-muted)] text-center">Ou payer avec</div>
              <div className="grid grid-cols-2 gap-3">
                <button className="w-full py-3 px-4 rounded-12 bg-white border border-[var(--border)] flex items-center justify-center gap-2 text-[14px] font-[500] text-[var(--text)] hover:bg-[var(--surface-1)] transition-colors">
                  <Apple size={18} />
                  <span>Apple Pay</span>
                </button>
                <button className="w-full py-3 px-4 rounded-12 bg-white border border-[var(--border)] flex items-center justify-center gap-2 text-[14px] font-[500] text-[var(--text)] hover:bg-[var(--surface-1)] transition-colors">
                  <span className="text-[#003087] font-[600]">PayPal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}