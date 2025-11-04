"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";
import { getMosqueDisplayName } from "@/lib/mosques";

export default function ZakatAlMaalPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const { canProceedFromAmount } = useDonationFlow();

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5";
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    
    const previousColor = meta.getAttribute("content");
    meta.setAttribute("content", themeColor);
    
    return () => {
      if (previousColor) {
        meta?.setAttribute("content", previousColor);
      } else {
        meta?.remove();
      }
    };
  }, []);

  // Initialize form values for Zakat al Maal
  useEffect(() => {
    form.setValue("frequency", "Unique", { shouldDirty: true });
    form.setValue("donationType", "Zakat", { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update amount in form
  useEffect(() => {
    if (amount > 0) {
      form.setValue("amount", amount, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      router.push("/step-personal-ds");
    }
  };

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug="creteil" />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      <div className="relative w-full bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]" style={{ height: "100svh", overflow: "hidden" }}>
        {/* Logo Neena en haut de la page */}
        <div className="absolute top-0 left-0 z-10 p-4">
          <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px] drop-shadow-lg hover:opacity-80 transition-opacity">
            Neena
          </a>
        </div>

        {/* Burger menu mobile en haut à droite */}
        <button 
          aria-label="Menu" 
          onClick={() => setIsMenuOpen(true)} 
          className="absolute top-4 right-4 z-10 md:hidden w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        
        {/* Main content area - starts below header */}
        <div className="relative w-full h-full flex flex-col" style={{ paddingTop: "var(--hdr-primary-h)" }}>
          
          {/* Card - scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
            <div className="w-full max-w-lg md:max-w-xl mx-auto">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-7 transition-all duration-300 ease-out">
                
                <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug mb-1">
                  Zakat al Maal
                </h1>
                <p className="text-center text-white/70 text-[14px] mb-6">
                  Aumône obligatoire sur les biens
                </p>

                <button 
                  onClick={() => setShowMosqueSelector(true)} 
                  className="w-full mb-6 p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-left"
                >
                  <p className="text-white/70 text-[12px] mb-1">Mosquée bénéficiaire</p>
                  <p className="text-white text-[15px] font-semibold">
                    {values.mosqueName ? `Mosquée de ${getMosqueDisplayName(values.mosqueName)}` : "Sélectionner une mosquée"}
                  </p>
                </button>

                {/* Hadith */}
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 mb-6">
                  <p className="text-[14px] md:text-[15px] text-white/95 leading-relaxed italic">
                    « Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis. »
                  </p>
                  <p className="text-[13px] text-white/75 mt-2">
                    — Coran, Sourate 9, Verset 103
                  </p>
                </div>

                {/* Info Nisab */}
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 mb-6 space-y-2">
                  <h3 className="text-white font-semibold text-[15px]">💰 Nisab (seuil minimum)</h3>
                  <p className="text-white/80 text-[14px] leading-relaxed">
                    La Zakat est obligatoire si vous possédez au moins <strong>85g d&apos;or</strong> ou <strong>595g d&apos;argent</strong> pendant une année lunaire complète.
                  </p>
                  <p className="text-white/70 text-[13px]">
                    Taux : <strong>2,5%</strong> de vos biens éligibles
                  </p>
                </div>

                {/* Calculateur simple */}
                <div className="space-y-6">
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
                    <label className="block text-white/80 text-[13px] font-medium mb-2">
                      Montant de votre Zakat (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount || ""}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      placeholder="Entrez le montant"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-[18px] font-semibold placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    />
                    <p className="text-white/60 text-[12px] mt-2">
                      💡 Pour calculer : <strong>(Biens éligibles) × 2,5%</strong>
                    </p>
                  </div>

                  {/* Montant total */}
                  {amount > 0 && (
                    <div className="rounded-2xl bg-white/15 border border-white/20 p-5 text-center space-y-3">
                      <p className="text-white/80 text-[14px] font-medium uppercase tracking-wide">
                        Montant total
                      </p>
                      <p className="text-white text-[42px] md:text-[48px] font-bold leading-none">
                        {formatEuro(amount)}
                      </p>
                      <p className="text-white/70 text-[13px]">
                        Vous paierez{" "}
                        <strong className="font-semibold text-white">
                          {formatEuro(amount * 0.34)}
                        </strong>
                        {" "}après déduction fiscale.
                      </p>
                    </div>
                  )}
                </div>

                {/* Button inside card */}
                <div className="mt-6">
                  <button
                    onClick={handleNext}
                    disabled={!(typeof values.amount === "number" && Number.isFinite(values.amount) && values.amount > 0)}
                    className="w-full h-11 rounded-2xl px-6 bg-white text-black font-semibold shadow-xl ring-1 ring-white/70 transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-px hover:brightness-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    Suivant
                    <ArrowRight size={18} className="opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

