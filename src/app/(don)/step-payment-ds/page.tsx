"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";
import { DonationFormValues } from "@/lib/schema";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { GlassCard, PrimaryButton, StepLabels, GlassSection, ToggleSwitch } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";

export default function StepPaymentDSPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const {
    amount,
    frequency,
    donationType,
    identityType = "Personnel",
    companyName,
    companySiret,
    firstName,
    lastName,
    address,
    wantsReceipt,
    coverFees,
    mosqueName,
    email,
  } = values;
  const baseAmount = Number.isFinite(amount) ? amount : 0;
  const feeAmount = coverFees ? Math.round(baseAmount * 0.012 * 100) / 100 : 0;
  const totalAmount = baseAmount + feeAmount;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const submitRef = useRef<(() => Promise<void>) | null>(null);

  // no scroll
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5"; // Match blue gradient
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

  const labelsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const [labelsBottom, setLabelsBottom] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [topGap, setTopGap] = useState(24);

  useEffect(() => {
    const update = () => {
      const labelsRect = labelsRef.current?.getBoundingClientRect();
      const tBottom = labelsRect ? labelsRect.bottom : 0;
      const b = bottomRef.current?.getBoundingClientRect().height ?? 0;
      setLabelsBottom(Math.round(tBottom));
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
    const compute = () => {
      const available = window.innerHeight - bottomOffset - labelsBottom;
      const cardH = cardWrapRef.current?.getBoundingClientRect().height ?? 0;
      const gap = Math.max(24, Math.floor((available - cardH) / 2));
      setTopGap(Number.isFinite(gap) ? gap : 24);
    };
    compute();
    const roCard = cardWrapRef.current ? new ResizeObserver(compute) : null;
    if (cardWrapRef.current && roCard) roCard.observe(cardWrapRef.current);
    window.addEventListener("resize", compute);
    return () => {
      roCard?.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [labelsBottom, bottomOffset]);

  const goBack = () => router.push("/step-personal-ds");
  const goPay = () => {
    if (isProcessing || !submitRef.current) return;
    submitRef.current();
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
          
          {/* Labels under header */}
          <div className="relative z-30 mx-auto w-full max-w-lg md:max-w-xl px-4 pt-2 pb-1">
            <div ref={labelsRef} className="flex justify-center">
              <div className="rounded-full bg-white/15 border border-white/20 backdrop-blur-md px-4 py-1.5 shadow-md">
                <StepLabels current="Paiement" />
              </div>
            </div>
          </div>

          {/* Card - centered in remaining space */}
          <div className="flex-1 flex items-center justify-center px-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)" }}>
          <div className="mx-auto w-full max-w-lg md:max-w-xl" ref={cardWrapRef} style={{ marginTop: `${topGap}px`, marginBottom: `${topGap}px` }}>
            <GlassCard>
              <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">Paiement</h1>

              <div className="mt-4 space-y-4">
                {/* Résumé + Option frais combinés */}
                <GlassSection>
                  <div className="flex flex-col items-center justify-center text-white pb-3 border-b border-white/10">
                    <div className="text-[28px] md:text-[32px] font-semibold leading-none">
                      {totalAmount <= 0 ? "—" : Number.isInteger(totalAmount) ? `${totalAmount} €` : `${totalAmount.toFixed(2)} €`}
                    </div>
                    {frequency ? (
                      <div className="mt-1 text-white/80 text-[13px]">{frequency}</div>
                    ) : null}
                    {(() => {
                      const label = identityType === "Entreprise" ? companyName : [firstName, lastName].filter(Boolean).join(" ");
                      return label ? <div className="mt-1 text-white/70 text-[13px] text-center">{label}</div> : null;
                    })()}
                  </div>
                  
                  <div className="flex items-center justify-between gap-3 pt-3">
                    <div className="flex-1 text-white/90 text-[13px] leading-relaxed text-left">
                      {(() => {
                        const mosque = mosqueName ? `la mosquée de ${mosqueName}` : "la mosquée";
                        const feeLabel = feeAmount <= 0 ? "0 €" : Number.isInteger(feeAmount) ? `${feeAmount} €` : `${feeAmount.toFixed(2)} €`;
                        return (
                          <span>
                            + <span className="text-white font-semibold">{feeLabel}</span> pour que 100% aille à {mosque}
                          </span>
                        );
                      })()}
                    </div>
                    <ToggleSwitch
                      checked={coverFees}
                      onChange={(checked) => form.setValue("coverFees", checked, { shouldDirty: true })}
                      ariaLabel="Activer l'ajout pour couvrir"
                    />
                  </div>
                </GlassSection>

                {/* Coordonnées bancaires */}
                <GlassSection>
                  {(() => {
                    return (
                      <StripePaymentMount
                        amount={totalAmount}
                        email={email}
                        metadata={{
                          mosque: mosqueName,
                          frequency,
                          donationType,
                          identityType,
                          firstName,
                          lastName,
                          companyName,
                          companySiret,
                          address,
                          wantsReceipt,
                          coverFees,
                          amountBase: baseAmount,
                          amountTotal: totalAmount,
                        }}
                        onReady={(handler) => {
                          submitRef.current = handler;
                        }}
                        onProcessingChange={setIsProcessing}
                        onStatusChange={(status) => {
                          if (status === "succeeded") {
                            const query = new URLSearchParams({
                              mosque: mosqueName || "",
                              amount: totalAmount > 0 ? String(totalAmount) : "",
                              freq: frequency || "",
                            }).toString();
                            router.push(`/merci${query ? `?${query}` : ""}`);
                          }
                        }}
                        onErrorChange={setStripeError}
                      />
                    );
                  })()}
                </GlassSection>
              </div>
            </GlassCard>
          </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div ref={bottomRef} className="fixed inset-x-0" style={{ bottom: "calc(env(safe-area-inset-bottom) + 14px)" }}>
        <div className="mx-auto w-full max-w-lg md:max-w-xl px-4">
          <div className="grid grid-cols-2 gap-3">
            <PrimaryButton width="full" variant="glass" onClick={() => goBack()}>
              <ArrowLeft size={18} />
              Retour
            </PrimaryButton>
            <PrimaryButton
              width="full"
              variant="white"
              onClick={goPay}
              disabled={isProcessing || !submitRef.current}
            >
              {isProcessing ? "Traitement…" : "Payer"}
              <CreditCard size={18} className="opacity-80" />
            </PrimaryButton>
            {stripeError ? (
              <div className="col-span-2 text-center text-red-200 text-[13px] leading-tight">
                {stripeError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

