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
import { GlassInput, ToggleSwitch, AddressAutocomplete, GlassTextarea, GlassSelect, PrimaryButton } from "@/components/ds";
import { StripePaymentMount } from "./StripeMount";
import { ChevronUp, User, HandHeart } from "lucide-react";
import { useDuaaFeed } from "@/features/duaa/useDuaaFeed";
import type { Category } from "@/types/duaa";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAmountV19Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [_isProcessing, _setIsProcessing] = useState(false);
  const [_stripeError, setStripeError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const submitRef = useRef<(() => Promise<void>) | null>(null);

  // Dua states
  const [duaa, setDuaa] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { addRequest } = useDuaaFeed();

  // Refs for scroll detection
  const amountCardRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const paymentCardRef = useRef<HTMLDivElement>(null);
  const thankYouRef = useRef<HTMLDivElement>(null);

  // Collapse states
  const [isAmountCollapsed, setIsAmountCollapsed] = useState(false);
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);
  const [_showScrollHint, setShowScrollHint] = useState(true);
  const [activeSection, setActiveSection] = useState(0); // 0=Amount, 1=Info, 2=Payment, 3=ThankYou

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

  // Intersection Observer for smart card collapse (horizontal scroll)
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px -10% 0px -10%',
      threshold: 0.5
    };

    const handleAmountIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(0);
          setIsAmountCollapsed(false);
        } else if (!entry.isIntersecting && isAmountValid) {
          setIsAmountCollapsed(true);
          setShowScrollHint(false);
        }
      });
    };

    const handleInfoIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(1);
          setIsInfoCollapsed(false);
        } else if (!entry.isIntersecting && isPersonalInfoComplete) {
          setIsInfoCollapsed(true);
        }
      });
    };

    const handlePaymentIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(2);
        }
      });
    };

    const handleThankYouIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(3);
        }
      });
    };

    const amountObserver = new IntersectionObserver(handleAmountIntersection, options);
    const infoObserver = new IntersectionObserver(handleInfoIntersection, options);
    const paymentObserver = new IntersectionObserver(handlePaymentIntersection, options);
    const thankYouObserver = new IntersectionObserver(handleThankYouIntersection, options);

    if (amountCardRef.current) {
      amountObserver.observe(amountCardRef.current);
    }
    if (infoCardRef.current) {
      infoObserver.observe(infoCardRef.current);
    }
    if (paymentCardRef.current) {
      paymentObserver.observe(paymentCardRef.current);
    }
    if (thankYouRef.current) {
      thankYouObserver.observe(thankYouRef.current);
    }

    return () => {
      amountObserver.disconnect();
      infoObserver.disconnect();
      paymentObserver.disconnect();
      thankYouObserver.disconnect();
    };
  }, [isAmountValid, isPersonalInfoComplete]);

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
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Get identity display for collapsed card
  const identityDisplay = useMemo(() => {
    if (values.identityType === "Entreprise") {
      return values.companyName || "Entreprise";
    }
    return values.firstName && values.lastName ? `${values.firstName} ${values.lastName}` : "Donateur";
  }, [values.identityType, values.companyName, values.firstName, values.lastName]);

  // Expand card on click (horizontal scroll)
  const handleExpandAmount = () => {
    setIsAmountCollapsed(false);
    setTimeout(() => {
      amountCardRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }, 300);
  };

  const handleExpandInfo = () => {
    setIsInfoCollapsed(false);
    setTimeout(() => {
      infoCardRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }, 300);
  };

  // Load categories for dua
  useEffect(() => {
    fetch("/api/duaa/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  // Auto-scroll to Thank You section on payment success (horizontal scroll)
  useEffect(() => {
    if (paymentSuccess && thankYouRef.current) {
      setTimeout(() => {
        thankYouRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      }, 500);
    }
  }, [paymentSuccess]);

  const handlePublish = () => {
    const text = duaa.trim();
    if (!text || !selectedCategory) return;
    setSubmitting(true);
    addRequest(text, selectedCategory, "Anonyme");
    setFeedback("Votre demande a bien ete partagee. QuAllah vous exauce.");
    setDuaa("");
    setSelectedCategory("");
    setTimeout(() => setFeedback(null), 4000);
    setSubmitting(false);
  };

  const goToDuaas = () => router.push("/duaa");

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

      {/* Main Snap Container - Horizontal Scroll */}
      <div 
        className="h-screen w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth z-10 relative"
        style={{ display: 'flex', flexDirection: 'row' }}
      >

        {/* Card 1: Amount */}
        <div 
          className="snap-center px-5 flex-shrink-0"
          style={{ 
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)"
          }}
        >
          <div className="w-full max-w-2xl" style={{ height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 8rem)', maxHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div 
              ref={amountCardRef}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8"
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div className="space-y-6 relative z-20 flex-1 flex flex-col justify-center">
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
            </div>

          </div>
        </div>

        {/* Card 2: Info */}
        <div 
          className="snap-center px-5 flex-shrink-0"
          style={{ 
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)"
          }}
        >
          <div className="w-full max-w-2xl" style={{ height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 8rem)', maxHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
            {isAmountCollapsed && isAmountValid && (
              <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4 flex-shrink-0" style={{ height: '72px' }}>
                <button onClick={handleExpandAmount} className="w-full h-full">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-3">
                      <HandHeart className="w-5 h-5 text-white" />
                      <div className="text-left">
                        <p className="text-white text-[17px] font-semibold">{formatEuro(totalAmount)}</p>
                        <p className="text-white/70 text-[13px]">{values.frequency}</p>
                      </div>
                    </div>
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  </div>
                </button>
              </div>
            )}

            <div 
              ref={infoCardRef}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8 flex-1"
              style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
            >
              <div className="space-y-6 relative z-20 flex-1 flex flex-col justify-center">
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
            </div>
          </div>
        </div>

        {/* Card 3: Payment */}
        <div 
          className="snap-center px-5 flex-shrink-0"
          style={{ 
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)"
          }}
        >
          <div className="w-full max-w-2xl" style={{ height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 8rem)', maxHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
            {isAmountCollapsed && isAmountValid && (
              <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4 flex-shrink-0" style={{ height: '72px' }}>
                <button onClick={handleExpandAmount} className="w-full h-full">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-3">
                      <HandHeart className="w-5 h-5 text-white" />
                      <p className="text-white text-[17px] font-semibold">{formatEuro(totalAmount)}</p>
                    </div>
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  </div>
                </button>
              </div>
            )}

            {isInfoCollapsed && isPersonalInfoComplete && (
              <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4 flex-shrink-0" style={{ height: '72px' }}>
                <button onClick={handleExpandInfo} className="w-full h-full">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-white" />
                      <p className="text-white text-[17px] font-semibold">{identityDisplay}</p>
                    </div>
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  </div>
                </button>
              </div>
            )}

            <div 
              ref={paymentCardRef}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8 flex-1"
              style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
            >
              <div className="space-y-6 relative z-20 flex-1 flex flex-col justify-center">
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
                    onStatusChange={(status) => {
                      if (status === "succeeded") {
                        setPaymentSuccess(true);
                      }
                    }}
                  />
                )}

                {!canShowPayment && (
                  <div className="text-center text-white/70 text-[15px] py-4">
                    Veuillez remplir les sections précédentes pour continuer.
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Thank You */}
        <div 
          ref={thankYouRef}
          className="snap-center px-5 flex-shrink-0"
          style={{ 
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)"
          }}
        >
          <div className="w-full max-w-2xl" style={{ height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 8rem)', maxHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-5 md:p-6 overflow-y-auto"
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div className="space-y-4 relative z-20 flex-1 flex flex-col justify-center">
                <div className="text-center space-y-2">
                  <h1 className="text-[28px] font-bold leading-tight text-white">
                    Merci pour votre don à la mosquée {getMosqueDisplayName(values.mosqueName)}.
                  </h1>
                  <p className="text-white/80 text-[15px] leading-relaxed">
                    QuAllah accepte votre sadaqa, vous comble de Sa miséricorde et la fasse rayonner au sein de la mosquée {getMosqueDisplayName(values.mosqueName)}.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left space-y-3">
                  <div className="space-y-1">
                    <div className="text-[17px] font-semibold text-white">Partager une demande de duaa</div>
                    <div className="text-[13px] text-white/65 leading-relaxed">Exprimez une intention pour laquelle vous souhaitez invoquer Allah.</div>
                  </div>
                  <div className="space-y-2.5">
                    <GlassSelect
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      options={categories.map((cat) => ({ value: cat.id, label: cat.title }))}
                      placeholder="Choisir une categorie..."
                    />

                    <GlassTextarea
                      value={duaa}
                      minRows={2}
                      onChange={(e) => setDuaa(e.target.value)}
                      placeholder="Je demande des duaa pour..."
                    />

                    <div className="flex justify-end">
                      <PrimaryButton
                        variant="white"
                        onClick={handlePublish}
                        disabled={submitting || !duaa.trim() || !selectedCategory}
                        className="px-6"
                      >
                        Publier
                      </PrimaryButton>
                    </div>
                  </div>
                  {feedback ? <div className="text-[15px] text-emerald-200 leading-relaxed">{feedback}</div> : null}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={goToDuaas}
                      className="text-[15px] text-white/70 hover:text-white transition-colors underline underline-offset-2"
                    >
                      Decouvrir les duaas de la communaute
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Horizontal Gesture Bar - Fixed at Bottom */}
      <div 
        className="fixed left-0 right-0 z-30 flex items-center justify-center"
        style={{ 
          bottom: "calc(env(safe-area-inset-bottom) + 2rem)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)"
        }}
      >
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          {/* Step Indicators */}
          <div className="flex items-center gap-1.5">
            <div className={`h-2 rounded-full transition-all ${activeSection === 0 ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
            <div className={`h-2 rounded-full transition-all ${activeSection === 1 ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
            <div className={`h-2 rounded-full transition-all ${activeSection === 2 ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
            <div className={`h-2 rounded-full transition-all ${activeSection === 3 ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

