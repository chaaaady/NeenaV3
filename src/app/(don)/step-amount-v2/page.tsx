"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";
import { GlassSegmented } from "@/components/ui/GlassSegmented";
import { GlassAmountPills } from "@/components/ui/GlassAmountPills";
import { StepLabels } from "@/components/ds";
import { getMosqueDisplayName } from "@/lib/mosques";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV2Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const { canProceedFromAmount } = useDonationFlow();
  const labelsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [_labelsOffset, setLabelsOffset] = useState(0);
  const [_bottomOffset, setBottomOffset] = useState(0);

  // Lock scroll for this page
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehaviorY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehaviorY = "none";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overscrollBehaviorY = prevOverscroll;
    };
  }, []);

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5"; // Match darker blue gradient
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

  // Measure labels (top block) and bottom action bar to center the card between them
  useEffect(() => {
    const update = () => {
      const t = labelsRef.current?.getBoundingClientRect().height ?? 0;
      const b = bottomRef.current?.getBoundingClientRect().height ?? 0;
      setLabelsOffset(Math.round(t));
      setBottomOffset(Math.round(b));
    };
    update();
    const roTop = labelsRef.current ? new ResizeObserver(update) : null;
    const roBottom = bottomRef.current ? new ResizeObserver(update) : null;
    if (labelsRef.current && roTop) roTop.observe(labelsRef.current);
    if (bottomRef.current && roBottom) roBottom.observe(bottomRef.current);
    window.addEventListener("resize", update);
    return () => {
      roTop?.disconnect();
      roBottom?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

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
      // Ne plus auto-sélectionner les montants prédéfinis pendant la saisie
      form.setValue("amount", numValue, { shouldDirty: true });
    }
  };

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      router.push("/step-personal-ds");
    }
  };

  const isPresetActive = typeof values.amount === "number" && PRESET_AMOUNTS.includes(values.amount) && otherAmountInput.trim() === "";
  const otherAmountDisplay = useMemo(() => {
    const n = parseFloat(otherAmountInput);
    if (!isNaN(n) && n > 0 && !PRESET_AMOUNTS.includes(n)) return `${n} €`;
    return "";
  }, [otherAmountInput]);

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
          
          {/* Labels under header */}
          <div className="relative z-30 mx-auto w-full max-w-lg md:max-w-xl px-4 pt-2 pb-1">
            <div ref={labelsRef} className="flex justify-center">
              <div className="rounded-full bg-white/15 border border-white/20 backdrop-blur-md px-4 py-1.5 shadow-md">
                <StepLabels current="Montant" />
              </div>
            </div>
          </div>

          {/* Card - centered in remaining space */}
          <div className="flex-1 flex items-center justify-center px-4 pt-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)" }}>
            <div className="w-full max-w-lg md:max-w-xl">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-7 transition-all duration-300 ease-out">
                <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">
                  Quel montant souhaitez-vous donner à la {" "}
                  <button onClick={() => setShowMosqueSelector(true)} className="underline decoration-white/40 underline-offset-4 hover:decoration-white transition-all">
                    mosquée de {getMosqueDisplayName(values.mosqueName)}
                  </button>
                  {" "}?
                </h1>

                <div className="mt-4 space-y-6">
                  <GlassSegmented
                    options={["Unique", "Vendredi", "Mensuel"]}
                    value={values.frequency}
                    onChange={(v) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
                    variant="light"
                    className="w-full"
                  />

                  <div className="w-full rounded-2xl bg-white/10 p-3.5">
                    {otherAmountDisplay ? (
                      <div className="h-11 flex items-center justify-center text-[18px] font-semibold text-white">{otherAmountDisplay}</div>
                    ) : (
                      <GlassAmountPills
                        amounts={PRESET_AMOUNTS}
                        activeAmount={isPresetActive ? (values.amount as number) : undefined}
                        onSelect={(amt) => handlePresetClick(amt)}
                      />
                    )}
                    <div className="mt-3">
                      <div className="relative">
                        <input
                          value={otherAmountInput}
                          onChange={(e) => {
                            if (isPresetActive) {
                              form.setValue("amount", NaN as unknown as number, { shouldDirty: true });
                            }
                            handleOtherAmountChange(e.target.value);
                          }}
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Autre montant"
                          className={"w-full h-11 rounded-2xl px-4 pr-10 border focus:outline-none focus:ring-2 focus:ring-white/35 text-[16px] " + (otherAmountDisplay ? "bg-transparent text-transparent caret-white placeholder-white/60 border-white/6" : "bg-transparent text-white placeholder-white/70 border-white/10")}
                          style={{ fontSize: "16px" }}
                          aria-invalid={!!otherAmountInput && isNaN(parseFloat(otherAmountInput))}
                          onKeyDown={(e) => { 
                            if (e.key === "Enter") {
                              e.preventDefault();
                              (e.currentTarget as HTMLInputElement).blur();
                            }
                          }}
                          onBlur={() => { 
                            const num = parseFloat(otherAmountInput); 
                            if (isNaN(num)) {
                              setOtherAmountInput("");
                            }
                            // Force viewport reset on iOS
                            window.scrollTo(0, 0);
                          }}
                        />
                        {!otherAmountDisplay && (
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/75 text-[16px]">€</span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 pl-4 pr-3 text-left text-[15px] text-white leading-relaxed">
                      Votre don de {formatEuro(values.amount)}
                      {values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}
                      {" "}ne vous coûtera que
                      {" "}
                      <strong className="font-semibold text-white">
                        {formatEuro(values.amount * 0.34)}
                        {values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}
                      </strong>
                      {" "}après déduction fiscale.
                    </p>
                  </div>

                  <GlassSegmented
                    options={["Sadaqah", "Zakat"]}
                    value={values.donationType}
                    onChange={(v) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
                    variant="light"
                    className="w-full"
                  />
                </div>

                <div className="pt-0">
                  {/* external CTA restored below card; keeping this container empty to preserve spacing if any */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fixed bottom action bar (sticky-like), aligned with card width */}
      <div ref={bottomRef} className="fixed inset-x-0" style={{ bottom: "calc(env(safe-area-inset-bottom) + 14px)" }}>
        <div className="mx-auto w-full max-w-lg md:max-w-xl px-4">
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!(typeof values.amount === "number" && Number.isFinite(values.amount) && values.amount > 0)}
              className="w-1/2 h-11 rounded-2xl px-6 bg-white text-black font-semibold shadow-xl ring-1 ring-white/70 transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-px hover:brightness-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              Suivant
              <ArrowRight size={18} className="opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

