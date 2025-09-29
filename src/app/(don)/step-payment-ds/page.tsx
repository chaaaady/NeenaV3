"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";
import { DonationFormValues } from "@/lib/schema";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { GlassCard, PrimaryButton, StepLabels, GlassSection, ToggleSwitch } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";

export default function StepPaymentDSPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
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

  const heroImageSrc = "/hero-creteil.png";

  const goBack = () => router.push("/step-personal-ds");
  const goPay = () => {
    if (isProcessing || !submitRef.current) return;
    submitRef.current();
  };

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      <div className="relative w-full" style={{ height: "100svh", overflow: "hidden" }}>
        <div className="absolute inset-0">
          <Image src={heroImageSrc} alt={values.mosqueName || "Mosquée"} fill sizes="100vw" className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Labels */}
        <div className="mx-auto w-full max-w-lg md:max-w-xl px-4" style={{ paddingTop: "calc(var(--hdr-primary-h) + 6px)" }}>
          <div ref={labelsRef} className="mb-2 flex justify-center">
            <div className="rounded-full bg-white/12 border border-white/15 backdrop-blur-md px-3 py-1 shadow-sm">
              <StepLabels current="Paiement" />
            </div>
          </div>
        </div>

        {/* Card centered between labels and bottom bar */}
        <div className="px-4">
          <div className="mx-auto w-full max-w-lg md:max-w-xl" ref={cardWrapRef} style={{ marginTop: `${topGap}px`, marginBottom: `${topGap}px` }}>
            <GlassCard>
              <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">Paiement</h1>

              <div className="mt-4 space-y-6">
                {/* Mini carte: Résumé */}
                <GlassSection>
                  <div className="flex flex-col items-center justify-center text-white">
                    <div className="text-[28px] md:text-[32px] font-semibold leading-none">
                      {(() => {
                        const base = Number((values as any)?.amount) || 0;
                        const fees = Boolean((values as any).coverFees) ? Math.round(base * 0.012 * 100) / 100 : 0;
                        const total = base + fees;
                        if (total <= 0) return "—";
                        return Number.isInteger(total) ? `${total} €` : `${total.toFixed(2)} €`;
                      })()}
                    </div>
                    {Boolean((values as any)?.frequency) && (
                      <div className="mt-1 text-white/80 text-[13px]">
                        {(values as any).frequency}
                      </div>
                    )}
                    {(() => {
                      const idType = (values as any)?.identityType;
                      const company = (values as any)?.companyName;
                      const first = (values as any)?.firstName;
                      const last = (values as any)?.lastName;
                      const label = idType === "Entreprise" ? company : [first, last].filter(Boolean).join(" ");
                      return label ? (
                        <div className="mt-1 text-white/70 text-[13px] text-center">
                          {label}
                        </div>
                      ) : null;
                    })()}
                  </div>
                </GlassSection>

                {/* Mini carte: Couvrir les frais */}
                <GlassSection>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 text-white/90 text-[14px] leading-relaxed text-left">
                      {(() => {
                        const base = Number((values as any)?.amount) || 0;
                        const feeAmt = Math.round(base * 0.012 * 100) / 100;
                        const mosque = (values as any)?.mosqueName ? `la mosquée de ${(values as any).mosqueName}` : "la mosquée";
                        const feeLabel = Number.isInteger(feeAmt) ? `${feeAmt} €` : `${feeAmt.toFixed(2)} €`;
                        return <span>Je rajoute <span className="text-white font-semibold">{feeLabel}</span> pour que 100% de mon don aille à {mosque}.</span>;
                      })()}
                    </div>
                    <ToggleSwitch
                      checked={Boolean((values as any).coverFees)}
                      onChange={(c) => form.setValue("coverFees" as any, c, { shouldDirty: true })}
                      ariaLabel="Activer l'ajout pour couvrir"
                    />
                  </div>
                </GlassSection>

                {/* Mini carte: Coordonnées bancaires (Stripe iframe placeholder) */}
                <GlassSection>
                  <div className="text-white text-[15px] mb-2">Paiement sécurisé</div>
                  {(() => {
                    const base = Number((values as any)?.amount) || 0;
                    const fees = Boolean((values as any).coverFees) ? Math.round(base * 0.012 * 100) / 100 : 0;
                    const total = base + fees;
                    return (
                      <StripePaymentMount
                        amount={total}
                        email={values.email}
                        metadata={{
                          mosque: values.mosqueName,
                          frequency: values.frequency,
                          donationType: values.donationType,
                          identityType: (values as any).identityType,
                          firstName: values.firstName,
                          lastName: values.lastName,
                          companyName: (values as any).companyName,
                          companySiret: (values as any).companySiret,
                          address: values.address,
                          wantsReceipt: values.wantsReceipt,
                          coverFees: values.coverFees,
                          amountBase: values.amount,
                          amountTotal: total,
                        }}
                        onReady={(handler) => {
                          submitRef.current = handler;
                        }}
                        onProcessingChange={setIsProcessing}
                        onStatusChange={(status) => {
                          if (status === "succeeded") {
                            const query = new URLSearchParams({
                              mosque: values.mosqueName || "",
                              amount: total > 0 ? String(total) : "",
                              freq: values.frequency || "",
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

