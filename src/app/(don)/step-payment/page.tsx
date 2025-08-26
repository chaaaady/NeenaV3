"use client";

import { useState, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, Heart } from "lucide-react";
import { AppBar, Stepper, Checkbox, PayPalButton, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components";
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
      <Stepper 
        steps={[
          { label: "Montant", status: "completed" },
          { label: "Info", status: "completed" },
          { label: "Payment", status: "active" }
        ]} 
      />
      <div className="app-container">
        <div className="app-card">
          <div className="space-y-4">
            <div className="app-title">Paiement sécurisé</div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="text-[14px] font-[700] text-[var(--text-muted)]">Résumé du don</div>
                <div className="text-[15px] text-[var(--text)] leading-relaxed">
                  {summarySentence}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-[14px] font-[700] text-[var(--text-muted)]">Méthode de paiement</div>
                <PayPalButton label="Payer avec PayPal" />
                
                <Checkbox
                  label="Je couvre les frais pour que 100% de mon don aille à la mosquée."
                  checked={values.coverFees}
                  onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
                />

                <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                  <span className="px-2 py-1 rounded-full border">3D Secure</span>
                  <span className="px-2 py-1 rounded-full border">SSL</span>
                </div>
                <div className="text-[12px] text-[var(--text-muted)]">
                  Nous ne stockons jamais votre carte. Données protégées (RGPD). Reçu fiscal par email.
                </div>
              </div>
            </div>
            
            {/* Boutons d'actions intégrés dans la carte */}
            <div className="pt-6 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={backToPersonal}
                  className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Back
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