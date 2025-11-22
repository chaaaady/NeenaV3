"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { GlassSegmented } from "@/components/ui/GlassSegmented";
import { GlassAmountPills } from "@/components/ui/GlassAmountPills";
import { getMosqueDisplayName } from "@/lib/mosques";
import { GlassInput, ToggleSwitch, AddressAutocomplete } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";
import { SnapScrollOrchestrator } from "@/components/donation/SnapScrollOrchestrator";
import { HandHeart, User } from "lucide-react";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

const PRAYER_BACKGROUNDS = [
  { id: 'fajr', name: 'Fajr', image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
  { id: 'dhuhr', name: 'Dhuhr', image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
  { id: 'asr', name: 'Asr', image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
  { id: 'maghrib', name: 'Maghrib', image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
  { id: 'isha', name: 'Isha', image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
  { id: 'v20', name: 'Original', image: '/background-v20.jpg', flip: true, statusBarColor: '#353535' }
];

export default function StepAmountV26Page() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black" />}>
      <StepAmountV26Content />
    </Suspense>
  );
}

function StepAmountV26Content() {
  const form = useFormContext<DonationFormValues>();
  const values = form.watch();
  const searchParams = useSearchParams();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [_stripeError, setStripeError] = useState<string | null>(null);
  const submitRef = useRef<(() => Promise<void>) | null>(null);
  
  // Récupérer la mosquée depuis l'URL ou le formulaire
  const mosqueeSlug = searchParams.get("mosquee") || "mosquee-sahaba-creteil";
  
  // Déterminer la prière actuelle
  const currentPrayer = useCurrentPrayer(mosqueeSlug);
  
  // Sélectionner le background en fonction de la prière actuelle
  const selectedBackground = useMemo(() => {
    const bg = PRAYER_BACKGROUNDS.find(b => b.id === currentPrayer);
    return bg || PRAYER_BACKGROUNDS[0];
  }, [currentPrayer]);

  // Calculate amounts
  const baseAmount = Number.isFinite(values.amount) ? values.amount : 0;
  const feeAmount = values.coverFees ? Math.round((baseAmount * 0.012 + 0.25) * 100) / 100 : 0;
  const calculatedFeeAmount = Math.round((baseAmount * 0.012 + 0.25) * 100) / 100;
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

  // Désactiver le scroll de la page (pour éviter conflit avec l'effet de rétractation)
  useEffect(() => {
    // Sauvegarder les styles originaux
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;
    
    // Désactiver le scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    
    return () => {
      // Restaurer les styles originaux
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  // Set theme-color for iPhone notch/status bar - adapté au background
  useEffect(() => {
    // Utiliser la couleur du background sélectionné
    const themeColor = selectedBackground.statusBarColor;
    
    // Meta theme-color pour la barre d'état
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", themeColor);

    // Apple status bar style
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement("meta");
      appleStatusBar.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.setAttribute("content", "black-translucent");

    // Viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, viewport-fit=cover"
      );
    }
  }, [selectedBackground]);

  // Init default amount
  useEffect(() => {
    if (!values.amount) {
      form.setValue("amount", 25, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [otherAmountDisplay, setOtherAmountDisplay] = useState("");

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
                <p className="text-white text-[17px] font-semibold">
                  {formatEuro(totalAmount)}
                  {values.frequency === "Vendredi" && <span className="text-white/70 font-normal">{" / vendredi"}</span>}
                  {values.frequency === "Mensuel" && <span className="text-white/70 font-normal">{" / mois"}</span>}
                </p>
                <p className="text-white/70 text-[13px]">{values.frequency === "Vendredi" ? "Jumuaa" : values.frequency || "Unique"}</p>
              </>
            ) : (
              <p className="text-white text-[17px] font-semibold">Montant</p>
            )}
          </div>
        </div>
      ),
      content: (
        <div className="space-y-5 relative z-20">
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
            <div className="rounded-2xl bg-white/5 p-3 space-y-3">
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
            <div className="rounded-xl bg-white/10 border border-white/15 p-3">
              <p className="text-white text-[15px] font-semibold leading-snug">
                Coût après déduction fiscale : 
                {values.frequency === "Unique" ? (
                  <span> {formatEuro(values.amount * 0.34)}</span>
                ) : (
                  <>
                    <br />
                    {formatEuro(values.amount * 0.34)}
                    {values.frequency === "Vendredi" && "/vendredi"}
                    {values.frequency === "Mensuel" && "/mois"}
                  </>
                )}
              </p>
              <p className="text-white/70 text-[13px] mt-1.5">
                {formatEuro(values.amount * 0.66)} vous seront déduits de vos impôts
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
              <>
                <p className="text-white text-[17px] font-semibold">{identityDisplay}</p>
                <p className="text-white/70 text-[13px]">
                  {values.wantsReceipt ? 'Avec reçu fiscal' : 'Sans reçu fiscal'}
                </p>
              </>
            ) : (
              <p className="text-white text-[17px] font-semibold">Informations</p>
            )}
          </div>
        </div>
      ),
      content: (
        <div className="space-y-5 relative z-20">
          <h2 className="text-[22px] font-semibold text-white text-center leading-tight">
            Renseignez vos informations
          </h2>

          <GlassSegmented
            options={["Personnel", "Entreprise"]}
            value={values.identityType || "Personnel"}
            onChange={(v) => form.setValue("identityType", v as "Personnel" | "Entreprise", { shouldDirty: true })}
          />

          {values.identityType === "Entreprise" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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

          <div className="rounded-xl bg-white/10 border border-white/15 p-3 relative z-20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-white text-[17px] font-semibold">Reçu fiscal</label>
              <ToggleSwitch
                checked={values.wantsReceipt || false}
                onChange={(checked) => form.setValue("wantsReceipt", checked, { shouldDirty: true })}
              />
            </div>
            {!values.wantsReceipt ? (
              <p className="text-white/70 text-[13px] mt-1.5 leading-relaxed">
                Veuillez indiquer si vous souhaitez recevoir afin de bénéficier de la déduction.
              </p>
            ) : (
              <p className="text-white/70 text-[13px] mt-1.5 leading-relaxed">
                Vous recevrez votre reçu fiscal en début d&apos;année {new Date().getFullYear() + 1}
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
              <label className="text-white text-[17px] font-semibold">Couvrir les frais bancaires</label>
              <ToggleSwitch
                checked={values.coverFees || false}
                onChange={(checked) => form.setValue("coverFees", checked, { shouldDirty: true })}
              />
            </div>
            {values.coverFees ? (
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
                Merci pour votre générosité
              </p>
            ) : (
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
                Offrez <span className="text-white font-semibold">{formatEuro(calculatedFeeAmount)}</span> de plus pour que chaque euro donné arrive intégralement à la mosquée.
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
    <div 
      className="h-screen w-full overflow-hidden relative bg-white"
      style={{ 
        touchAction: 'none', // Empêche le scroll natif
        overscrollBehavior: 'none' // Empêche le bounce scroll
      }}
    >
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug="creteil" />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      {/* Image Background avec transition */}
      <div 
        className="fixed inset-0 overflow-hidden" 
        style={{ 
          top: "calc(-1 * env(safe-area-inset-top))",
          bottom: "calc(-1 * env(safe-area-inset-bottom))",
          left: "calc(-1 * env(safe-area-inset-left))",
          right: "calc(-1 * env(safe-area-inset-right))"
        }}
      >
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${selectedBackground.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: selectedBackground.flip ? 'scaleY(-1)' : 'none',
          }}
        />
        
        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-black/40" />
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

      {/* Responsive Orchestrator */}
      <SnapScrollOrchestrator steps={steps} />
    </div>
  );
}
