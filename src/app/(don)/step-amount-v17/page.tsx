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
import { 
  CreditCard, 
  User, 
  DollarSign, 
  Info, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  ArrowRight,
  Building2,
  UserCircle2,
  Mail,
  MapPin,
  FileText,
  Zap
} from "lucide-react";

// Shadcn UI Components
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassRadioGroup } from "@/components/ui/glass-radio-group";
import { GlassAmountGrid } from "@/components/ui/glass-amount-grid";
import { GlassSwitch } from "@/components/ui/glass-switch";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassProgress } from "@/components/ui/glass-progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV17Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [_isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const submitRef = useRef<(() => Promise<void>) | null>(null);
  const [activeTab, setActiveTab] = useState("amount");

  // Calculate amounts
  const baseAmount = Number.isFinite(values.amount) ? values.amount : 0;
  const feeAmount = values.coverFees ? Math.round(baseAmount * 0.012 * 100) / 100 : 0;
  const totalAmount = baseAmount + feeAmount;
  const taxDeduction = baseAmount * 0.66;

  // Validation & Progress
  const isAmountValid = useMemo(() => {
    return Number.isFinite(values.amount) && values.amount > 0;
  }, [values.amount]);

  const isPersonalInfoComplete = useMemo(() => {
    if (values.identityType === "Entreprise") {
      return !!(values.companyName?.trim() && values.companySiret?.trim() && values.email?.trim() && values.address?.trim());
    }
    return !!(values.firstName?.trim() && values.lastName?.trim() && values.email?.trim() && values.address?.trim());
  }, [values.identityType, values.companyName, values.companySiret, values.firstName, values.lastName, values.email, values.address]);

  const canShowPayment = isPersonalInfoComplete && isAmountValid;

  // Calculate progress
  const progress = useMemo(() => {
    let score = 0;
    if (isAmountValid) score += 33;
    if (isPersonalInfoComplete) score += 33;
    if (canShowPayment) score += 34;
    return score;
  }, [isAmountValid, isPersonalInfoComplete, canShowPayment]);

  // Auto-switch tabs based on completion
  useEffect(() => {
    if (isAmountValid && !isPersonalInfoComplete && activeTab === "amount") {
      setTimeout(() => setActiveTab("info"), 300);
    }
  }, [isAmountValid, isPersonalInfoComplete, activeTab]);

  // Theme color
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
          <div className="flex items-center justify-between px-4 h-14" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <a href="/qui-sommes-nous" className="text-[20px] font-[900] text-white tracking-[-0.5px] hover:opacity-80 transition-opacity">
              Neena
            </a>
            <button 
              aria-label="Menu" 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative w-full pt-20 pb-12 px-4">
          <div className="mx-auto w-full max-w-7xl">
            
            {/* Hero + Progress */}
            <div className="max-w-3xl mx-auto mb-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Plateforme sécurisée</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Soutenez la{" "}
                  <button 
                    onClick={() => setShowMosqueSelector(true)}
                    className="underline decoration-white/40 decoration-2 underline-offset-4 hover:decoration-white/70 transition-all inline-flex items-center gap-1"
                  >
                    Mosquée de {getMosqueDisplayName(values.mosqueName)}
                    <ArrowRight className="w-4 h-4 inline" />
                  </button>
                </h1>
              </div>

              <GlassProgress value={progress} />
            </div>

            {/* Layout: Tabs (left) + Summary Sidebar (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Content - Tabs */}
              <div className="lg:col-span-2 space-y-6">
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  
                  {/* Tabs Navigation */}
                  <GlassCard className="p-2 mb-6">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
                      <TabsTrigger 
                        value="amount" 
                        className="data-[state=active]:bg-white/25 data-[state=active]:text-white text-white/70 rounded-xl transition-all py-3 backdrop-blur-md"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Montant</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="info" 
                        className="data-[state=active]:bg-white/25 data-[state=active]:text-white text-white/70 rounded-xl transition-all py-3 backdrop-blur-md"
                        disabled={!isAmountValid}
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Informations</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payment" 
                        className="data-[state=active]:bg-white/25 data-[state=active]:text-white text-white/70 rounded-xl transition-all py-3 backdrop-blur-md"
                        disabled={!canShowPayment}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Paiement</span>
                      </TabsTrigger>
                    </TabsList>
                  </GlassCard>

                  {/* Tab: Amount */}
                  <TabsContent value="amount" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <GlassCard className="p-6">
                      <GlassCardContent className="p-0 space-y-6">
                        
                        {/* Frequency */}
                        <div className="space-y-3">
                          <Label className="text-white text-sm font-semibold flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Fréquence
                          </Label>
                          <GlassRadioGroup
                            options={["Unique", "Vendredi", "Mensuel"]}
                            value={values.frequency}
                            onValueChange={(v) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
                            className="w-full"
                          />
                        </div>

                        {/* Amount Grid */}
                        <div className="space-y-3">
                          <Label className="text-white text-sm font-semibold">Montant</Label>
                          <div className="rounded-2xl bg-white/5 p-4 space-y-4">
                            {otherAmountDisplay ? (
                              <div className="flex items-center justify-center h-16">
                                <div className="text-4xl font-bold text-white">
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
                                style={{ fontSize: "16px" }}
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
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-base font-medium pointer-events-none">
                                  €
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tax Info */}
                        {values.amount > 0 && (
                          <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-500/15 border border-emerald-400/25 p-4">
                            <div className="flex items-start gap-3">
                              <TrendingUp className="w-5 h-5 text-emerald-200 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-emerald-100 font-semibold text-sm mb-1">
                                  Déduction fiscale : {formatEuro(taxDeduction)}
                                </p>
                                <p className="text-emerald-200/80 text-xs leading-relaxed">
                                  Coût réel après déduction : <strong>{formatEuro(values.amount * 0.34)}</strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Donation Type */}
                        <div className="space-y-3">
                          <Label className="text-white text-sm font-semibold">Type de don</Label>
                          <GlassRadioGroup
                            options={["Sadaqah", "Zakat"]}
                            value={values.donationType}
                            onValueChange={(v) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
                            className="w-full"
                          />
                        </div>

                      </GlassCardContent>
                    </GlassCard>

                    {isAmountValid && (
                      <button
                        onClick={() => setActiveTab("info")}
                        className="w-full py-4 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold transition-all flex items-center justify-center gap-2 group"
                      >
                        Continuer
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </TabsContent>

                  {/* Tab: Info */}
                  <TabsContent value="info" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <GlassCard className="p-6">
                      <GlassCardContent className="p-0 space-y-6">
                        
                        <GlassRadioGroup
                          options={["Personnel", "Entreprise"]}
                          value={values.identityType || "Personnel"}
                          onValueChange={(v) => form.setValue("identityType", v as "Personnel" | "Entreprise", { shouldDirty: true })}
                          className="w-full"
                        />

                        {values.identityType === "Entreprise" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <GlassInput
                                  placeholder="Raison sociale"
                                  value={values.companyName || ""}
                                  onChange={(e) => form.setValue("companyName", e.target.value, { shouldDirty: true })}
                                  className="pl-11"
                                />
                              </div>
                              <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <GlassInput
                                  placeholder="SIRET"
                                  value={values.companySiret || ""}
                                  onChange={(e) => form.setValue("companySiret", e.target.value, { shouldDirty: true })}
                                  className="pl-11"
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                              <GlassInput
                                placeholder="Email"
                                type="email"
                                value={values.email || ""}
                                onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
                                className="pl-11"
                              />
                            </div>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10" />
                              <AddressAutocomplete
                                placeholder="Adresse"
                                value={values.address || ""}
                                onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="relative">
                                <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <GlassInput
                                  placeholder="Prénom"
                                  value={values.firstName || ""}
                                  onChange={(e) => form.setValue("firstName", e.target.value, { shouldDirty: true })}
                                  className="pl-11"
                                />
                              </div>
                              <div className="relative">
                                <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <GlassInput
                                  placeholder="Nom"
                                  value={values.lastName || ""}
                                  onChange={(e) => form.setValue("lastName", e.target.value, { shouldDirty: true })}
                                  className="pl-11"
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                              <GlassInput
                                placeholder="Email"
                                type="email"
                                value={values.email || ""}
                                onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
                                className="pl-11"
                              />
                            </div>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10" />
                              <AddressAutocomplete
                                placeholder="Adresse"
                                value={values.address || ""}
                                onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Receipt */}
                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-white/80" />
                              <span className="text-white text-sm font-medium">Reçu fiscal</span>
                            </div>
                            <GlassSwitch
                              checked={Boolean(values.wantsReceipt)}
                              onCheckedChange={(c) => form.setValue("wantsReceipt", c, { shouldDirty: true })}
                            />
                          </div>
                        </div>

                      </GlassCardContent>
                    </GlassCard>

                    {isPersonalInfoComplete && (
                      <button
                        onClick={() => setActiveTab("payment")}
                        className="w-full py-4 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold transition-all flex items-center justify-center gap-2 group"
                      >
                        Continuer vers le paiement
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </TabsContent>

                  {/* Tab: Payment */}
                  <TabsContent value="payment" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <GlassCard className="p-6">
                      <GlassCardContent className="p-0">
                        {!canShowPayment ? (
                          <div className="text-center py-12">
                            <Info className="w-12 h-12 text-white/40 mx-auto mb-3" />
                            <p className="text-white/70 text-sm">
                              Complétez les étapes précédentes
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            
                            {/* Fee Toggle */}
                            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-white font-medium text-sm mb-1">
                                    Couvrir les frais ({formatEuro(feeAmount)})
                                  </p>
                                  <p className="text-white/70 text-xs">
                                    100% à la mosquée
                                  </p>
                                </div>
                                <GlassSwitch
                                  checked={Boolean(values.coverFees)}
                                  onCheckedChange={(checked) => form.setValue("coverFees", checked, { shouldDirty: true })}
                                />
                              </div>
                            </div>

                            {/* Stripe */}
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
                              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                                <p className="text-red-200 text-sm text-center">{stripeError}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </GlassCardContent>
                    </GlassCard>
                  </TabsContent>

                </Tabs>

              </div>

              {/* Sidebar - Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  
                  {/* Summary Card */}
                  <GlassCard className="p-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-white font-bold text-lg">Récapitulatif</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Montant</span>
                          <span className="text-white font-semibold">{formatEuro(baseAmount)}</span>
                        </div>
                        
                        {values.coverFees && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/70">Frais</span>
                            <span className="text-white font-semibold">+{formatEuro(feeAmount)}</span>
                          </div>
                        )}

                        <div className="h-px bg-white/10 my-3" />

                        <div className="flex items-center justify-between">
                          <span className="text-white font-semibold">Total</span>
                          <span className="text-2xl font-bold text-white">{formatEuro(totalAmount)}</span>
                        </div>

                        <GlassBadge variant="info" className="w-full justify-center">
                          {values.frequency === "Unique" ? "Don unique" : values.frequency === "Vendredi" ? "Chaque vendredi" : "Mensuel"}
                        </GlassBadge>
                      </div>

                      {baseAmount > 0 && (
                        <>
                          <div className="h-px bg-white/10 my-3" />
                          <div className="text-center space-y-1">
                            <p className="text-xs text-white/60">Déduction fiscale</p>
                            <p className="text-lg font-bold text-emerald-300">{formatEuro(taxDeduction)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </GlassCard>

                  {/* Info Card */}
                  <GlassCard className="p-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-xs leading-relaxed">
                        Votre don est sécurisé et vous recevrez un reçu fiscal par email
                      </p>
                    </div>
                  </GlassCard>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
