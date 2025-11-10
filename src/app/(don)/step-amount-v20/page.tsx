"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { GlassSegmented } from "@/components/ui/GlassSegmented";
import { GlassAmountPills } from "@/components/ui/GlassAmountPills";
import { getMosqueDisplayName } from "@/lib/mosques";
import { GlassInput, ToggleSwitch, AddressAutocomplete } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";
import { CardOrchestratorV2 } from "@/components/donation/CardOrchestratorV2";
import { HandHeart, User } from "lucide-react";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV20Page() {
  const form = useFormContext<DonationFormValues>();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [_stripeError, setStripeError] = useState<string | null>(null);
  const submitRef = useRef<(() => Promise<void>) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Calculate amounts
  const baseAmount = Number.isFinite(values.amount) ? values.amount : 0;
  const feeAmount = values.coverFees ? Math.round(baseAmount * 0.012 * 100) / 100 : 0;
  const totalAmount = baseAmount + feeAmount;

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

  // Get identity display for summary
  const identityDisplay = useMemo(() => {
    if (values.identityType === "Entreprise") {
      return values.companyName || "Entreprise";
    }
    return values.firstName && values.lastName ? `${values.firstName} ${values.lastName}` : "Donateur";
  }, [values.identityType, values.companyName, values.firstName, values.lastName]);

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#ffffff";
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
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, viewport-fit=cover"
      );
    }

    const bg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = themeColor;

    return () => {
      if (previousColor) meta.setAttribute("content", previousColor);
      document.body.style.backgroundColor = bg;
    };
  }, []);

  // Init default amount
  useEffect(() => {
    if (!values.amount) {
      form.setValue("amount", 25, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [otherAmountDisplay, setOtherAmountDisplay] = useState("");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, []);

  const handlePresetClick = (amt: number) => {
    setOtherAmountInput("");
    form.setValue("amount", amt, { shouldDirty: true });
  };

  const handleOtherAmountChange = (value: string) => {
    setOtherAmountInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      form.setValue("amount", numValue, { shouldDirty: true });
    }
  };

  const isPresetActive = typeof values.amount === "number" && PRESET_AMOUNTS.includes(values.amount) && otherAmountInput.trim() === "";
  
  useEffect(() => {
    const num = parseFloat(otherAmountInput);
    if (otherAmountInput && !isNaN(num) && num > 0 && !PRESET_AMOUNTS.includes(num)) {
      setOtherAmountDisplay(`${num} €`);
    } else {
      setOtherAmountDisplay("");
    }
  }, [otherAmountInput]);

  // Define the steps
  const steps = [
    {
      id: 'amount',
      header: (
        <div className="flex items-center gap-3">
          <HandHeart className="w-5 h-5 text-white" />
          <div className="text-left">
            {isAmountValid ? (
              <>
                <p className="text-white text-[17px] font-semibold">{formatEuro(totalAmount)}</p>
                <p className="text-white/70 text-[13px]">{values.frequency || "Unique"}</p>
              </>
            ) : (
              <p className="text-white text-[17px] font-semibold">Montant</p>
            )}
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6 relative z-20">
          <h2 className="text-[22px] font-semibold text-white text-center leading-tight">
            Quel montant souhaitez-vous donner à la mosquée de {getMosqueDisplayName(values.mosqueName)} ?
          </h2>
          
          <div className="space-y-3 relative z-20">
            <GlassSegmented
              options={["Unique", "Jumuaa", "Mensuel"]}
              value={values.frequency === "Vendredi" ? "Jumuaa" : values.frequency}
              onChange={(v) => form.setValue("frequency", v === "Jumuaa" ? "Vendredi" : v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-white/5 p-4 space-y-4">
              {otherAmountDisplay ? (
                <div className="flex items-center justify-center h-16">
                  <div className="text-4xl font-bold text-white">{otherAmountDisplay}</div>
                </div>
              ) : (
                <GlassAmountPills
                  amounts={PRESET_AMOUNTS}
                  activeAmount={isPresetActive ? (values.amount as number) : undefined}
                  onSelect={handlePresetClick}
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
                  style={{ fontSize: "17px" }}
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

          {values.amount > 0 && (
            <div className="rounded-xl bg-white/10 border border-white/15 p-4">
              <p className="text-white text-[15px] font-semibold leading-snug">
                Coût réel : {formatEuro(values.amount * 0.34)}
                {values.frequency === "Vendredi" && <span className="text-white/70">{" / vendredi"}</span>}
                {values.frequency === "Mensuel" && <span className="text-white/70">{" / mois"}</span>}
              </p>
              <p className="text-white/70 text-[13px] mt-1">
                Après déduction fiscale de 66%
              </p>
            </div>
          )}

          <div className="space-y-3 relative z-20">
            <GlassSegmented
              options={["Sadaqah", "Zakat"]}
              value={values.donationType}
              onChange={(v) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
            />
          </div>
        </div>
      )
    },
    {
      id: 'info',
      header: (
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-white" />
          <div className="text-left">
            {isPersonalInfoComplete ? (
              <p className="text-white text-[17px] font-semibold">{identityDisplay}</p>
            ) : (
              <p className="text-white text-[17px] font-semibold">Informations</p>
            )}
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6 relative z-20">
          <h2 className="text-[22px] font-semibold text-white text-center leading-tight">
            Vos informations
          </h2>

          <GlassSegmented
            options={["Personnel", "Entreprise"]}
            value={values.identityType || "Personnel"}
            onChange={(v) => form.setValue("identityType", v as "Personnel" | "Entreprise", { shouldDirty: true })}
          />

          {values.identityType === "Entreprise" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
              <GlassInput
                placeholder="Email"
                type="email"
                value={values.email || ""}
                onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
              />
              <AddressAutocomplete
                placeholder="Adresse"
                value={values.address || ""}
                onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
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
              </div>
              <GlassInput
                placeholder="Email"
                type="email"
                value={values.email || ""}
                onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })}
              />
              <AddressAutocomplete
                placeholder="Adresse"
                value={values.address || ""}
                onChange={(value) => form.setValue("address", value, { shouldDirty: true })}
              />
            </div>
          )}

          <div className="rounded-xl bg-white/10 border border-white/15 p-4 relative z-20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white text-[17px] font-semibold">Reçu fiscal</label>
              <ToggleSwitch
                checked={values.wantsReceipt || false}
                onChange={(checked) => form.setValue("wantsReceipt", checked, { shouldDirty: true })}
              />
            </div>
            {!values.wantsReceipt ? (
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
                Veuillez indiquer si vous souhaitez recevoir afin de bénéficier de la déduction.
              </p>
            ) : (
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
                Vous recevrez votre reçu fiscal en fin dannée.
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'payment',
      header: (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <p className="text-white text-[17px] font-semibold">Paiement</p>
        </div>
      ),
      content: (
        <div className="space-y-6 relative z-20">
          <h2 className="text-[22px] font-semibold text-white text-center leading-tight">
            Votre paiement sécurisé
          </h2>

          <div className="rounded-xl bg-white/10 border border-white/15 p-4 relative z-20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white text-[17px] font-semibold">Couvrir les frais</label>
              <ToggleSwitch
                checked={values.coverFees || false}
                onChange={(checked) => form.setValue("coverFees", checked, { shouldDirty: true })}
              />
            </div>
            {values.coverFees ? (
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
                Offrez <span className="text-white font-semibold">{formatEuro(feeAmount)}</span> de plus pour que chaque euro donné arrive intégralement à la mosquée.
              </p>
            ) : (
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
                Les frais de transaction (1,2%) seront déduits de votre don.
              </p>
            )}
          </div>

          {canShowPayment && (
            <StripePaymentMount
              amount={totalAmount}
              email={values.email || ""}
              metadata={{
                mosque: values.mosqueName || "",
                frequency: values.frequency,
                donationType: values.donationType,
                identityType: values.identityType || "Personnel",
                firstName: values.firstName || "",
                lastName: values.lastName || "",
                companyName: values.companyName || "",
                companySiret: values.companySiret || "",
                address: values.address || "",
                wantsReceipt: values.wantsReceipt ? "true" : "false",
                coverFees: values.coverFees ? "true" : "false",
                amountBase: baseAmount.toString(),
                amountTotal: totalAmount.toString(),
                email: values.email || ""
              }}
              onErrorChange={(err: string | null) => setStripeError(err)}
              onReady={(submitFn) => {
                submitRef.current = submitFn;
              }}
              onStatusChange={() => {
                // Handle payment success
              }}
            />
          )}

          {!canShowPayment && (
            <div className="text-center text-white/70 text-[15px] py-4">
              Veuillez remplir les sections précédentes pour continuer.
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="h-screen w-full overflow-hidden relative bg-white">
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
          poster="/bg-video-poster-v14.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: "100%", minHeight: "100%" }}
          ref={videoRef}
        >
          <source src="/bg-video.mp4" type="video/mp4" />
          <source src="/bg-video.webm" type="video/webm" />
        </video>
        
        <div className="absolute inset-0 bg-black/40" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.3) 50%, rgba(59,130,246,0.2) 100%)"
          }}
        />
      </div>

      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-30" style={{ 
        paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)"
      }}>
        <div className="flex items-center justify-between px-5 h-12">
          <a href="/qui-sommes-nous" className="text-[20px] font-[900] text-white tracking-[-0.5px]">
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

      {/* Card Orchestrator V2 */}
      <CardOrchestratorV2 steps={steps} />
    </div>
  );
}
