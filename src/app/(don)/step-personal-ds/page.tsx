"use client";

import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { useState, useEffect, useRef } from "react";
import { DonationFormValues } from "@/lib/schema";
import { GlassCard, PrimaryButton, StepLabels, ToggleSwitch } from "@/components/ds";
import { GlassSegmented } from "@/components/ui/GlassSegmented";
import { GlassInput } from "@/components/ds/GlassInput";

export default function StepPersonalDSPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const labelsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const [labelsBottom, setLabelsBottom] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [topGap, setTopGap] = useState(24);

  // lock scroll
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

  // Compute dynamic top/bottom gap so the card centers exactly between labels and bottom bar
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

  const identityType = (values.identityType as any) || "Personnel";

  const handleIdentityChange = (type: string) => {
    form.setValue("identityType", type as any, { shouldDirty: true });
    if (type === "Personnel") {
      // keep fields as-is
    } else if (type === "Entreprise") {
      // ensure company fields exist but do not auto-fill
    }
  };

  const goNext = () => {
    router.push("/step-payment-ds");
  };
  const goBack = () => {
    router.push("/step-amount-v2");
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

        <div className="px-4" style={{ paddingTop: "calc(var(--hdr-primary-h) + 6px)" }}>
          <div ref={labelsRef} className="mx-auto w-full max-w-lg md:max-w-xl mb-2 flex justify-center">
            <div className="rounded-full bg-white/12 border border-white/15 backdrop-blur-md px-3 py-1 shadow-sm">
              <StepLabels current="Information" />
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="mx-auto w-full max-w-lg md:max-w-xl" ref={cardWrapRef} style={{ marginTop: `${topGap}px`, marginBottom: `${topGap}px` }}>
            <GlassCard>
                <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">
                  Vos informations personnelles
                </h1>

                <div className="mt-4 space-y-6">
                  <GlassSegmented
                    options={["Personnel", "Entreprise"]}
                    value={identityType}
                    onChange={handleIdentityChange}
                    variant="light"
                    ariaLabel="Type d'identité"
                  />

                  {identityType === "Entreprise" ? (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                      <GlassInput
                        placeholder="Raison sociale"
                        value={(values as any).companyName || ""}
                        onChange={(e) => form.setValue("companyName" as any, e.target.value, { shouldDirty: true })}
                      />
                      <GlassInput
                        placeholder="SIRET"
                        value={(values as any).siret || ""}
                        onChange={(e) => form.setValue("siret" as any, e.target.value, { shouldDirty: true })}
                      />
                      <div className="col-span-2">
                        <GlassInput
                          placeholder="Email"
                          type="email"
                          value={values.email || ""}
                          onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
                        />
                      </div>
                      <div className="col-span-2">
                        <GlassInput
                          placeholder="Adresse"
                          value={(values as any).address || ""}
                          onChange={(e) => form.setValue("address" as any, e.target.value, { shouldDirty: true })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                      <GlassInput
                        placeholder="Prénom"
                        value={values.firstName || ""}
                        onChange={(e) => form.setValue("firstName", e.target.value, { shouldDirty: true })}
                      />
                      <GlassInput
                        placeholder="Nom"
                        value={values.lastName || ""}
                        onChange={(e) => form.setValue("lastName", e.target.value, { shouldDirty: true })}
                      />
                      <div className="col-span-2">
                        <GlassInput
                          placeholder="Email"
                          type="email"
                          value={values.email || ""}
                          onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
                        />
                      </div>
                      <div className="col-span-2">
                        <GlassInput
                          placeholder="Adresse"
                          value={(values as any).address || ""}
                          onChange={(e) => form.setValue("address" as any, e.target.value, { shouldDirty: true })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-white/90 text-[14px]">Recevoir un reçu fiscal</span>
                    <ToggleSwitch
                      checked={Boolean((values as any).wantReceipt)}
                      onChange={(c) => form.setValue("wantReceipt" as any, c, { shouldDirty: true })}
                      ariaLabel="Recevoir un reçu fiscal"
                    />
                  </div>
                </div>
            </GlassCard>
          </div>
        </div>
      </div>
      {/* Fixed bottom navigation bar */}
      <div ref={bottomRef} className="fixed inset-x-0" style={{ bottom: "calc(env(safe-area-inset-bottom) + 14px)" }}>
        <div className="mx-auto w-full max-w-lg md:max-w-xl px-4">
          <div className="grid grid-cols-2 gap-3">
            <PrimaryButton width="full" variant="glass" onClick={() => goBack()}>
              <ArrowLeft size={18} />
              Retour
            </PrimaryButton>
            <PrimaryButton width="full" variant="white" onClick={() => goNext()}>
              Suivant
              <ArrowRight size={18} className="opacity-80 transition-transform duration-300 group-hover:translate-x-0.5" />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}