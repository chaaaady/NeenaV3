"use client";

import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { HeaderMosquee } from "@/components";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { useState, useEffect, useRef } from "react";
import { DonationFormValues } from "@/lib/schema";
import { GlassCard, PrimaryButton, StepLabels, ToggleSwitch, AddressAutocomplete } from "@/components/ds";
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
  const [_topGap, setTopGap] = useState(24);

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

  const identityType = values.identityType || "Personnel";

  const handleIdentityChange = (type: "Personnel" | "Entreprise") => {
    form.setValue("identityType", type, { shouldDirty: true });
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
                <StepLabels current="Information" />
              </div>
            </div>
          </div>

          {/* Card - centered in remaining space */}
          <div className="flex-1 flex items-center justify-center px-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)" }}>
            <div className="w-full max-w-lg md:max-w-xl" ref={cardWrapRef}>
              <GlassCard>
                <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">
                  Vos informations personnelles
                </h1>

                <div className="mt-4 space-y-6">
                  <GlassSegmented
                    options={["Personnel", "Entreprise"]}
                    value={identityType}
                    onChange={(next) => handleIdentityChange(next as "Personnel" | "Entreprise")}
                    variant="light"
                    ariaLabel="Type d'identité"
                  />

                  {identityType === "Entreprise" ? (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                      <GlassInput
                        placeholder="Raison sociale"
                        value={values.companyName || ""}
                        onChange={(e) => form.setValue("companyName", e.target.value, { shouldDirty: true })}
                      />
                      <GlassInput
                        placeholder="SIRET"
                        value={values.companySiret || ""}
                        onChange={(e) => form.setValue("companySiret", e.target.value, { shouldDirty: true })}
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
                        <AddressAutocomplete
                          placeholder="Adresse"
                          value={values.address || ""}
                          onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
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
                        <AddressAutocomplete
                          placeholder="Adresse"
                          value={values.address || ""}
                          onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-white/90 text-[14px]">Recevoir un reçu fiscal</span>
                    <ToggleSwitch
                      checked={Boolean(values.wantsReceipt)}
                      onChange={(c) => form.setValue("wantsReceipt", c, { shouldDirty: true })}
                      ariaLabel="Recevoir un reçu fiscal"
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
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