"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { GlassSegmented } from "@/components/ui/GlassSegmented";
import { GlassAmountPills } from "@/components/ui/GlassAmountPills";
import { getMosqueDisplayName } from "@/lib/mosques";
import { GlassInput, ToggleSwitch, AddressAutocomplete, GlassSection } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV13Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const submitRef = useRef<(() => Promise<void>) | null>(null);

  // Calculate amounts
  const baseAmount = Number.isFinite(values.amount) ? values.amount : 0;
  const feeAmount = values.coverFees ? Math.round(baseAmount * 0.012 * 100) / 100 : 0;
  const totalAmount = baseAmount + feeAmount;

  // Validation - check if personal info is complete before showing payment
  const isPersonalInfoComplete = useMemo(() => {
    if (values.identityType === "Entreprise") {
      return !!(values.companyName?.trim() && values.companySiret?.trim() && values.email?.trim() && values.address?.trim());
    }
    return !!(values.firstName?.trim() && values.lastName?.trim() && values.email?.trim() && values.address?.trim());
  }, [values.identityType, values.companyName, values.companySiret, values.firstName, values.lastName, values.email, values.address]);

  const isAmountValid = useMemo(() => {
    return Number.isFinite(values.amount) && values.amount > 0;
  }, [values.amount]);

  const canShowPayment = isPersonalInfoComplete && isAmountValid;


  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#3b5a8f"; // Blue matching video + overlays for iOS notch and gesture bar
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    
    const previousColor = meta.getAttribute("content");
    meta.setAttribute("content", themeColor);

    // Ensure viewport-fit=cover for iOS safe areas
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      const currentContent = viewport.getAttribute("content") || "";
      if (!currentContent.includes("viewport-fit")) {
        viewport.setAttribute("content", currentContent + ", viewport-fit=cover");
      }
    }
    
    return () => {
      if (previousColor) {
        meta?.setAttribute("content", previousColor);
      } else {
        meta?.remove();
      }
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


  const isPresetActive = typeof values.amount === "number" && PRESET_AMOUNTS.includes(values.amount) && otherAmountInput.trim() === "";
  const otherAmountDisplay = useMemo(() => {
    const n = parseFloat(otherAmountInput);
    if (!isNaN(n) && n > 0 && !PRESET_AMOUNTS.includes(n)) return `${n} €`;
    return "";
  }, [otherAmountInput]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3b5a8f" }}>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug="creteil" />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      {/* Animated Video Background */}
      <div 
        className="fixed inset-0 overflow-hidden" 
        style={{ 
          top: "calc(-1 * env(safe-area-inset-top))",
          bottom: "calc(-1 * env(safe-area-inset-bottom))",
          left: "calc(-1 * env(safe-area-inset-left))",
          right: "calc(-1 * env(safe-area-inset-right))"
        }}
      >
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            minWidth: "100%",
            minHeight: "100%"
          }}
          ref={(video) => {
            if (video) {
              video.playbackRate = 1.25; // Accélérer à 125% de la vitesse normale
            }
          }}
        >
          <source src="/bg-video-new.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay to improve contrast */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Subtle overlay for depth - enrichit le glassmorphism */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.3) 50%, rgba(59,130,246,0.2) 100%)"
          }}
        />
        
        {/* Animated glow - mouvement subtil */}
        <div 
          className="absolute inset-0 opacity-12"
          style={{
            background: `
              radial-gradient(circle at 35% 35%, rgba(96,165,250,0.3) 0%, transparent 50%),
              radial-gradient(circle at 65% 65%, rgba(59,130,246,0.25) 0%, transparent 50%)
            `,
            animation: "meshMove 22s ease-in-out infinite"
          }}
        />
        
      </div>

      <div className="relative w-full min-h-screen" style={{ 
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)"
      }}>
        {/* Header complètement transparent */}
        <div 
          className="absolute top-0 left-0 right-0 z-10"
        >
          <div className="flex items-center justify-between px-4 h-12" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            {/* Logo Neena */}
            <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px] hover:opacity-80 transition-opacity">
              Neena
            </a>

            {/* Burger menu mobile */}
            <button 
              aria-label="Menu" 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main content area - starts below header */}
        <div className="relative w-full pt-16 pb-12 px-4">
          <div className="mx-auto w-full max-w-lg md:max-w-xl space-y-8">
            
            {/* Section 1: Montant */}
            <section className="w-full space-y-5">
              {/* Titre AU-DESSUS de la carte */}
              <h1 className="text-center text-white/95 font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">
                Quel montant souhaitez-vous donner à la {" "}
                <button onClick={() => setShowMosqueSelector(true)} className="underline decoration-white/50 underline-offset-4 hover:decoration-white transition-all">
                  mosquée de {getMosqueDisplayName(values.mosqueName)}
                </button>
                {" "}?
              </h1>

              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.20] via-white/[0.15] to-white/[0.10] backdrop-blur-xl shadow-2xl p-6 md:p-7">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-[13px] font-medium mb-2 pl-2">Fréquence</label>
                    <GlassSegmented
                      options={["Unique", "Vendredi", "Mensuel"]}
                      value={values.frequency}
                      onChange={(v) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
                      variant="light"
                      className="w-full"
                    />
                  </div>

                  <div className="w-full rounded-2xl bg-white/10 p-4">
                    {otherAmountDisplay ? (
                      <div className="h-11 flex items-center justify-center text-[18px] font-semibold text-white">{otherAmountDisplay}</div>
                    ) : (
                      <GlassAmountPills
                        amounts={PRESET_AMOUNTS}
                        activeAmount={isPresetActive ? (values.amount as number) : undefined}
                        onSelect={(amt) => handlePresetClick(amt)}
                      />
                    )}
                    <div className="mt-4">
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
                          className={"w-full h-12 rounded-2xl px-4 pr-10 border focus:outline-none focus:ring-2 focus:ring-white/35 text-[16px] " + (otherAmountDisplay ? "bg-transparent text-transparent caret-white placeholder-white/60 border-white/6" : "bg-transparent text-white placeholder-white/70 border-white/10")}
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

                  </div>

                  {/* Message déduction fiscale */}
                  {Number.isFinite(values.amount) && values.amount > 0 && (
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                      <p className="text-[14px] text-white font-semibold leading-relaxed">
                        Déduction fiscale de 66%
                      </p>
                      <p className="text-[13px] text-white/80 leading-relaxed mt-1">
                        Votre don de <strong className="text-white">{formatEuro(values.amount)}{values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}</strong> ne vous coûtera réellement que <strong className="text-white">{formatEuro(values.amount * 0.34)}{values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}</strong> après déduction fiscale.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-white/80 text-[13px] font-medium mb-2 pl-2">Type de don</label>
                    <GlassSegmented
                      options={["Sadaqah", "Zakat"]}
                      value={values.donationType}
                      onChange={(v) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
                      variant="light"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Informations personnelles */}
            <section className="w-full space-y-3">
              {/* Titre AU-DESSUS de la carte */}
              <h2 className="text-center text-white/95 font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">
                Vos informations personnelles
              </h2>

              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.20] via-white/[0.15] to-white/[0.10] backdrop-blur-xl shadow-2xl p-6 md:p-7">
                <div className="space-y-4">
                  <GlassSegmented
                    options={["Personnel", "Entreprise"]}
                    value={values.identityType || "Personnel"}
                    onChange={(v) => form.setValue("identityType", v as "Personnel" | "Entreprise", { shouldDirty: true })}
                    variant="light"
                    ariaLabel="Type d'identité"
                  />

                  {values.identityType === "Entreprise" ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
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
                    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
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

                  {/* Toggle reçu fiscal avec explication */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/95 text-[14px] font-medium">Recevoir un reçu fiscal</span>
                      <ToggleSwitch
                        checked={Boolean(values.wantsReceipt)}
                        onChange={(c) => form.setValue("wantsReceipt", c, { shouldDirty: true })}
                        ariaLabel="Recevoir un reçu fiscal"
                      />
                    </div>
                    <p className="text-white/70 text-[12px] leading-relaxed">
                      Votre reçu fiscal vous sera automatiquement envoyé par e-mail pour votre déclaration d'impôts
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Paiement sécurisé */}
            <section className="w-full space-y-3">
              {/* Titre AU-DESSUS de la carte */}
              <h2 className="text-center text-white/95 font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug">
                Votre paiement sécurisé
              </h2>

              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.20] via-white/[0.15] to-white/[0.10] backdrop-blur-xl shadow-2xl p-6 md:p-7">
                {!canShowPayment ? (
                  <div className="text-center py-8">
                    <p className="text-white/70 text-[15px] leading-relaxed">
                      Veuillez compléter les informations ci-dessus pour accéder au paiement sécurisé.
                    </p>
                    {!isAmountValid && (
                      <p className="mt-2 text-white/60 text-[13px]">
                        • Montant du don requis
                      </p>
                    )}
                    {!isPersonalInfoComplete && (
                      <p className="mt-2 text-white/60 text-[13px]">
                        • Informations personnelles requises
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Résumé du don réorganisé */}
                    <GlassSection>
                      {/* Option frais EN PREMIER */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex-1 text-white/90 text-[14px] leading-relaxed text-left">
                          {(() => {
                            const feeLabel = `${feeAmount.toFixed(2).replace('.', ',')} €`;
                            return (
                              <span>
                                Offrez <span className="text-white font-semibold">{feeLabel}</span> de plus pour que chaque euro donné arrive intégralement à la mosquée
                              </span>
                            );
                          })()}
                        </div>
                        <ToggleSwitch
                          checked={Boolean(values.coverFees)}
                          onChange={(checked) => form.setValue("coverFees", checked, { shouldDirty: true })}
                          ariaLabel="Offrir un montant supplémentaire pour couvrir les frais"
                        />
                      </div>
                      
                      {/* Résumé du montant APRÈS */}
                      <div className="flex flex-col items-center justify-center text-white pt-3">
                        <div className="text-[28px] md:text-[32px] font-semibold leading-none">
                          {totalAmount <= 0 ? "—" : Number.isInteger(totalAmount) ? `${totalAmount} €` : `${totalAmount.toFixed(2)} €`}
                        </div>
                        {values.frequency ? (
                          <div className="mt-1 text-white/80 text-[13px]">{values.frequency}</div>
                        ) : null}
                      </div>
                    </GlassSection>

                  {/* Coordonnées bancaires */}
                  <GlassSection>
                    <StripePaymentMount
                      amount={totalAmount}
                      email={values.email || ""}
                      metadata={{
                        mosque: values.mosqueName || "",
                        frequency: values.frequency || "",
                        donationType: values.donationType || "",
                        identityType: values.identityType || "Personnel",
                        firstName: values.firstName || "",
                        lastName: values.lastName || "",
                        companyName: values.companyName || "",
                        companySiret: values.companySiret || "",
                        address: values.address || "",
                        wantsReceipt: values.wantsReceipt || false,
                        coverFees: values.coverFees || false,
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
                            mosque: values.mosqueName || "",
                            amount: totalAmount > 0 ? String(totalAmount) : "",
                            freq: values.frequency || "",
                          }).toString();
                          router.push(`/merci${query ? `?${query}` : ""}`);
                        }
                      }}
                      onErrorChange={setStripeError}
                    />
                  </GlassSection>

                  {stripeError ? (
                    <div className="text-center text-red-200 text-[13px] leading-tight mt-3">
                      {stripeError}
                    </div>
                  ) : null}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

