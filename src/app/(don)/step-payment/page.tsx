"use client";

import { useState, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, Heart, CreditCard, Calendar, Shield } from "lucide-react";
import { AppBar, Stepper, Checkbox, PayPalButton, SideMenu, MosqueSelectorModal, Input } from "@/components";
import { DonateOverlay } from "@/components/DonateOverlay";
import { buildDonationSummary } from "@/features/donation/summary";
import { useDonationFlow } from "@/features/donation/useDonationFlow";
import { DonationFormValues } from "@/lib/schema";
import { formatEuro } from "@/lib/currency";

export default function StepPaymentPage() {
  const form = useFormContext<DonationFormValues>();
  const _router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayVars, setOverlayVars] = useState<{ cx: number; cy: number }>({ cx: 0, cy: 0 });
  const [overlayBg, setOverlayBg] = useState<string>("");
  const { backToPersonal } = useDonationFlow();
  const donateBtnRef = useRef<HTMLButtonElement>(null);

  const summarySentence = useMemo(() => buildDonationSummary(values), [values]);

  const handleSubmit = () => {
    const btn = donateBtnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setOverlayVars({ cx, cy });
      try {
        const c = window.getComputedStyle(btn).backgroundColor;
        setOverlayBg(c || "var(--brand)");
      } catch {}
      setIsOverlayOpen(true);
    }
  };

  return (
    <>
      <DonateOverlay
        open={isOverlayOpen}
        cx={overlayVars.cx}
        cy={overlayVars.cy}
        background={overlayBg}
        summary={summarySentence}
        values={values}
        onClose={() => setIsOverlayOpen(false)}
      />
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
        {/* Mini carte pour le résumé */}
        <div className="app-card mb-3">
          <div className="text-[15px] text-[var(--text)] leading-relaxed">
            {summarySentence}
          </div>
        </div>

        {/* Carte principale pour le paiement */}
        <div className="app-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="app-title">Paiement sécurisé</div>
              <Stepper 
                steps={[
                  { label: "Montant", status: "completed" },
                  { label: "Info", status: "completed" },
                  { label: "Payment", status: "active" }
                ]} 
              />
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Input
                  value={values.cardNumber}
                  onChange={(v: string) => form.setValue("cardNumber", v, { shouldDirty: true })}
                  autoComplete="cc-number"
                  leftIcon={<CreditCard size={18} />}
                  placeholder="Numéro de carte"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={values.cardExp}
                    onChange={(v: string) => form.setValue("cardExp", v, { shouldDirty: true })}
                    placeholder="MM/AA"
                    leftIcon={<Calendar size={18} />}
                  />
                  <Input
                    value={values.cardCvc}
                    onChange={(v: string) => form.setValue("cardCvc", v, { shouldDirty: true })}
                    placeholder="CVC"
                    leftIcon={<Shield size={18} />}
                  />
                </div>
              </div>
              
              <div className="h-[1px] bg-[var(--border)]"></div>
              <div className="text-[13px] text-[var(--text-muted)]">Autres méthodes</div>
              
              <PayPalButton label="Payer avec PayPal" />
              
              <Checkbox
                label={`Je rajoute ${formatEuro(values.amount * 0.029)} pour que 100% de mon don aille à la mosquée`}
                checked={values.coverFees}
                onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
              />
            </div>
            
            {/* Boutons d'actions intégrés dans la carte */}
            <div className="pt-6 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={backToPersonal}
                  className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  data-variant="success"
                  ref={donateBtnRef}
                  className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Faire un don de {formatEuro(values.amount)}
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}