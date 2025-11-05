"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { getMosqueDisplayName } from "@/lib/mosques";
import { AddressAutocomplete } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";
import { Check, Sparkles, Heart, Shield } from "lucide-react";

// Shadcn UI Glass Components
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassRadioGroup } from "@/components/ui/glass-radio-group";
import { GlassAmountGrid } from "@/components/ui/glass-amount-grid";
import { GlassSwitch } from "@/components/ui/glass-switch";
import { GlassBadge } from "@/components/ui/glass-badge";
import { Label } from "@/components/ui/label";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV16Page() {
  const form = useFormContext<DonationFormValues>();
  const _router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [_isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const submitRef = useRef<(() => Promise<void>) | null>(null);

  // Calculate amounts
  const baseAmount = Number.isFinite(values.amount) ? values.amount : 0;
  const feeAmount = values.coverFees ? Math.round(baseAmount * 0.012 * 100) / 100 : 0;
  const totalAmount = baseAmount + feeAmount;
  const taxDeduction = baseAmount * 0.66; // 66% déduction fiscale

  // Validation
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
    const themeColor = "#3b5a8f";
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    
    const previousColor = meta.getAttribute("content");
    meta.setAttribute("content", themeColor);

    const viewport = document.querySelector('meta[name="viewport"]');
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

      {/* Video Background */}
      <div 
        className="fixed inset-0 overflow-hidden" 
        style={{ 
          top: "calc(-1 * env(safe-area-inset-top))",
          bottom: "calc(-1 * env(safe-area-inset-bottom))",
          left: "calc(-1 * env(safe-area-inset-left))",
          right: "calc(-1 * env(safe-area-inset-right))"
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/bg-video-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: "100%", minHeight: "100%" }}
          ref={(video) => { if (video) video.playbackRate = 1.25; }}
        >
          <source src="/bg-video-new.mp4" type="video/mp4" />
          <source src="/bg-video-new.webm" type="video/webm" />
        </video>
        
        <div className="absolute inset-0 bg-black/30" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.3) 50%, rgba(59,130,246,0.2) 100%)"
          }}
        />
      </div>

      <div className="relative w-full min-h-screen" style={{ 
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)"
      }}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center justify-between px-6 h-16" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <a href="/qui-sommes-nous" className="text-[22px] font-[900] text-white tracking-[-0.5px] hover:opacity-80 transition-opacity">
              Neena
            </a>

            <button 
              aria-label="Menu" 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative w-full pt-24 pb-16 px-4 md:px-6">
          <div className="mx-auto w-full max-w-2xl space-y-12">
            
            {/* Hero Section */}
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-white">Don sécurisé et 100% transparent</span>
              </div>
              
              <h1 className="text-[32px] md:text-[42px] font-[900] text-white leading-[1.1] tracking-[-0.02em]">
                Soutenez la{" "}
                <button 
                  onClick={() => setShowMosqueSelector(true)} 
                  className="relative inline-flex items-center gap-2 text-white hover:text-white/90 transition-all group"
                >
                  <span className="underline decoration-white/40 decoration-2 underline-offset-4 group-hover:decoration-white/70">
                    Mosquée de {getMosqueDisplayName(values.mosqueName)}
                  </span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </h1>

              <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                Chaque contribution aide à maintenir un lieu de culte accessible et accueillant pour tous
              </p>
            </div>

            {/* Live Summary Card - Sticky */}
            {baseAmount > 0 && (
              <GlassCard className="sticky top-24 z-20 p-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/30 to-emerald-500/30 flex items-center justify-center border border-green-400/30">
                      <Heart className="w-6 h-6 text-green-200 fill-green-200/50" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium">Votre contribution</p>
                      <p className="text-2xl font-bold text-white">{formatEuro(totalAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <GlassBadge variant="success" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      {values.frequency === "Unique" ? "Don unique" : values.frequency === "Vendredi" ? "Chaque vendredi" : "Mensuel"}
                    </GlassBadge>
                    <p className="text-xs text-white/60">
                      Déduction fiscale : <span className="text-white/90 font-semibold">{formatEuro(taxDeduction)}</span>
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Section 1: Montant - Apple Style */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Choisissez votre montant
                </h2>
              </div>

              <GlassCard className="p-8 md:p-10">
                <GlassCardContent className="p-0 space-y-8">
                  
                  {/* Frequency */}
                  <div className="space-y-4">
                    <Label className="text-white/90 text-base font-semibold flex items-center gap-2">
                      Fréquence de don
                      <GlassBadge variant="info" className="text-xs">Recommandé : Mensuel</GlassBadge>
                    </Label>
                    <GlassRadioGroup
                      options={["Unique", "Vendredi", "Mensuel"]}
                      value={values.frequency}
                      onValueChange={(v) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
                      className="w-full"
                    />
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label className="text-white/90 text-base font-semibold">
                      Montant
                    </Label>
                    
                    <div className="rounded-3xl bg-white/5 p-6 space-y-6">
                      {otherAmountDisplay ? (
                        <div className="flex items-center justify-center h-20">
                          <div className="text-5xl font-bold text-white tracking-tight">
                            {otherAmountDisplay}
                          </div>
                        </div>
                      ) : (
                        <GlassAmountGrid
                          amounts={PRESET_AMOUNTS}
                          value={isPresetActive ? (values.amount as number) : undefined}
                          onValueChange={handlePresetClick}
                        />
                      )}

                      {/* Custom Amount Input */}
                      <div className="relative">
                        <GlassInput
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
                          className="h-14 text-lg"
                          style={{ fontSize: "18px" }}
                          onKeyDown={(e) => { 
                            if (e.key === "Enter") {
                              e.preventDefault();
                              (e.currentTarget as HTMLInputElement).blur();
                            }
                          }}
                          onBlur={() => { 
                            const num = parseFloat(otherAmountInput); 
                            if (isNaN(num)) setOtherAmountInput("");
                          }}
                        />
                        {otherAmountInput && (
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/80 text-lg font-semibold pointer-events-none">
                            €
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tax Benefit */}
                  {values.amount > 0 && (
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/30 p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-200" />
                        </div>
                        <div className="flex-1">
                          <p className="text-emerald-100 font-semibold text-base mb-1">
                            Avantage fiscal : {formatEuro(taxDeduction)}
                          </p>
                          <p className="text-emerald-200/80 text-sm leading-relaxed">
                            Votre don de <strong>{formatEuro(values.amount)}</strong> ne vous coûtera réellement que <strong>{formatEuro(values.amount * 0.34)}</strong> après déduction fiscale de 66%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Donation Type */}
                  <div className="space-y-4">
                    <Label className="text-white/90 text-base font-semibold">
                      Type de don
                    </Label>
                    <GlassRadioGroup
                      options={["Sadaqah", "Zakat"]}
                      value={values.donationType}
                      onValueChange={(v) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
                      className="w-full"
                    />
                  </div>

                </GlassCardContent>
              </GlassCard>
            </section>

            {/* Section 2: Personal Info */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Vos informations
                </h2>
              </div>

              <GlassCard className="p-8 md:p-10">
                <GlassCardContent className="p-0 space-y-8">
                  
                  <GlassRadioGroup
                    options={["Personnel", "Entreprise"]}
                    value={values.identityType || "Personnel"}
                    onValueChange={(v) => form.setValue("identityType", v as "Personnel" | "Entreprise", { shouldDirty: true })}
                    className="w-full"
                  />

                  {values.identityType === "Entreprise" ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassInput
                          placeholder="Raison sociale"
                          value={values.companyName || ""}
                          onChange={(e) => form.setValue("companyName", e.target.value, { shouldDirty: true })}
                          className="h-14"
                        />
                        <GlassInput
                          placeholder="SIRET"
                          value={values.companySiret || ""}
                          onChange={(e) => form.setValue("companySiret", e.target.value, { shouldDirty: true })}
                          className="h-14"
                        />
                      </div>
                      <GlassInput
                        placeholder="Email professionnel"
                        type="email"
                        value={values.email || ""}
                        onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
                        className="h-14"
                      />
                      <AddressAutocomplete
                        placeholder="Adresse complète"
                        value={values.address || ""}
                        onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassInput
                          placeholder="Prénom"
                          value={values.firstName || ""}
                          onChange={(e) => form.setValue("firstName", e.target.value, { shouldDirty: true })}
                          className="h-14"
                        />
                        <GlassInput
                          placeholder="Nom"
                          value={values.lastName || ""}
                          onChange={(e) => form.setValue("lastName", e.target.value, { shouldDirty: true })}
                          className="h-14"
                        />
                      </div>
                      <GlassInput
                        placeholder="Email"
                        type="email"
                        value={values.email || ""}
                        onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
                        className="h-14"
                      />
                      <AddressAutocomplete
                        placeholder="Adresse complète"
                        value={values.address || ""}
                        onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
                      />
                    </div>
                  )}

                  {/* Receipt Toggle */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-white/80" />
                        <span className="text-white font-semibold text-base">Reçu fiscal</span>
                      </div>
                      <GlassSwitch
                        checked={Boolean(values.wantsReceipt)}
                        onCheckedChange={(c) => form.setValue("wantsReceipt", c, { shouldDirty: true })}
                      />
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed pl-8">
                      Recevez automatiquement votre reçu fiscal par email pour votre déclaration d&apos;impôts
                    </p>
                  </div>

                </GlassCardContent>
              </GlassCard>
            </section>

            {/* Section 3: Payment */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Paiement sécurisé
                </h2>
              </div>

              <GlassCard className="p-8 md:p-10">
                <GlassCardContent className="p-0">
                  {!canShowPayment ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">
                        Complétez les étapes précédentes pour accéder au paiement sécurisé
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Summary with Fee Option */}
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-5">
                        
                        {/* Fee Toggle */}
                        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
                          <div className="flex-1">
                            <p className="text-white font-medium text-base mb-1">
                              Couvrir les frais ({formatEuro(feeAmount)})
                            </p>
                            <p className="text-white/70 text-sm leading-relaxed">
                              Assurez-vous que 100% de votre don arrive à la mosquée
                            </p>
                          </div>
                          <GlassSwitch
                            checked={Boolean(values.coverFees)}
                            onCheckedChange={(checked) => form.setValue("coverFees", checked, { shouldDirty: true })}
                          />
                        </div>
                        
                        {/* Total */}
                        <div className="flex items-baseline justify-between">
                          <span className="text-white/80 text-lg">Total</span>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-white">
                              {formatEuro(totalAmount)}
                            </div>
                            <div className="text-sm text-white/60 mt-1">
                              {values.frequency === "Unique" ? "Paiement unique" : values.frequency === "Vendredi" ? "Chaque vendredi" : "Chaque mois"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stripe Payment */}
                      <StripePaymentMount
                        amount={totalAmount}
                        firstName={values.firstName || ""}
                        lastName={values.lastName || ""}
                        email={values.email || ""}
                        address={values.address || ""}
                        mosqueName={values.mosqueName || ""}
                        frequency={values.frequency}
                        donationType={values.donationType}
                        coverFees={values.coverFees || false}
                        wantsReceipt={values.wantsReceipt || false}
                        identityType={values.identityType || "Personnel"}
                        companyName={values.companyName || ""}
                        companySiret={values.companySiret || ""}
                        onReady={(submit) => { submitRef.current = submit; }}
                        onProcessingChange={setIsProcessing}
                        onErrorChange={setStripeError}
                      />

                      {stripeError && (
                        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
                          <p className="text-red-200 text-sm leading-relaxed text-center">
                            {stripeError}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </section>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 pb-4">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Shield className="w-4 h-4" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Check className="w-4 h-4" />
                <span>100% transparent</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
