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

export default function StepAmountV18Page() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [otherAmountInput, setOtherAmountInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [_isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
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

  // Intersection Observer for smart card collapse
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.3
    };

    const handleAmountIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && isAmountValid) {
          setIsAmountCollapsed(true);
        } else if (entry.isIntersecting) {
          setIsAmountCollapsed(false);
        }
      });
    };

    const handleInfoIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && isPersonalInfoComplete) {
          setIsInfoCollapsed(true);
        } else if (entry.isIntersecting) {
          setIsInfoCollapsed(false);
        }
      });
    };

    const amountObserver = new IntersectionObserver(handleAmountIntersection, options);
    const infoObserver = new IntersectionObserver(handleInfoIntersection, options);

    if (amountCardRef.current) {
      amountObserver.observe(amountCardRef.current);
    }
    if (infoCardRef.current) {
      infoObserver.observe(infoCardRef.current);
    }

    return () => {
      amountObserver.disconnect();
      infoObserver.disconnect();
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

  // Expand card on click
  const handleExpandAmount = () => {
    setIsAmountCollapsed(false);
    setTimeout(() => {
      amountCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleExpandInfo = () => {
    setIsInfoCollapsed(false);
    setTimeout(() => {
      infoCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Auto-scroll to Thank You section on payment success
  useEffect(() => {
    if (paymentSuccess && thankYouRef.current) {
      setTimeout(() => {
        thankYouRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)"
      }}>
        <div className="flex items-center justify-center px-4 h-12 backdrop-blur-md bg-black/10">
          <a href="/qui-sommes-nous" className="text-[20px] font-[900] text-white tracking-[-0.5px]">
            Neena
          </a>
          <button 
            aria-label="Menu" 
            onClick={() => setIsMenuOpen(true)} 
            className="md:hidden w-10 h-10 absolute right-4 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Snap Container */}
      <div 
        className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth z-10 relative"
        style={{ 
          paddingTop: "calc(env(safe-area-inset-top) + 3rem)"
        }}
      >

        {/* Card 1: Amount */}
        <div 
          className="snap-center w-full px-4 flex items-center justify-center"
          style={{ height: "calc(100vh - env(safe-area-inset-top) - 3rem)" }}
        >
          <div className="w-full max-w-2xl">
            <div 
              ref={amountCardRef}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8"
            >
              <div className="space-y-6 relative z-20">
                <h2 className="text-xl font-bold text-white text-center">
                  Quel montant souhaitez-vous donner ?
                </h2>
                
                <GlassSegmented
                  options={["Unique", "Vendredi", "Mensuel"]}
                  value={values.frequency}
                  onChange={(v) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
                />

                <GlassAmountPills
                  amounts={PRESET_AMOUNTS}
                  activeAmount={isPresetActive ? (values.amount as number) : undefined}
                  onSelect={handlePresetClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Info */}
        <div 
          className="snap-center w-full px-4 flex items-center justify-center"
          style={{ height: "calc(100vh - env(safe-area-inset-top) - 3rem)" }}
        >
          <div className="w-full max-w-2xl space-y-4">
            {isAmountCollapsed && isAmountValid && (
              <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4">
                <button onClick={handleExpandAmount} className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HandHeart className="w-5 h-5 text-white" />
                      <div className="text-left">
                        <p className="text-white text-sm font-semibold">{formatEuro(totalAmount)}</p>
                        <p className="text-white/70 text-xs">{values.frequency}</p>
                      </div>
                    </div>
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  </div>
                </button>
              </div>
            )}

            <div 
              ref={infoCardRef}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8"
            >
              <div className="space-y-6 relative z-20">
                <h2 className="text-xl font-bold text-white text-center">
                  Vos informations
                </h2>

                <GlassSegmented
                  options={["Personnel", "Entreprise"]}
                  value={values.identityType || "Personnel"}
                  onChange={(v) => form.setValue("identityType", v as "Personnel" | "Entreprise", { shouldDirty: true })}
                />

                <div className="space-y-4">
                  <GlassInput
                    placeholder="Prenom"
                    value={values.firstName || ""}
                    onChange={(e) => form.setValue("firstName", e.target.value, { shouldDirty: true })}
                  />
                  <GlassInput
                    placeholder="Nom"
                    value={values.lastName || ""}
                    onChange={(e) => form.setValue("lastName", e.target.value, { shouldDirty: true })}
                  />
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
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Payment */}
        <div 
          className="snap-center w-full px-4 flex items-center justify-center"
          style={{ height: "calc(100vh - env(safe-area-inset-top) - 3rem)" }}
        >
          <div className="w-full max-w-2xl space-y-4">
            {isAmountCollapsed && isAmountValid && (
              <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4">
                <button onClick={handleExpandAmount} className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HandHeart className="w-5 h-5 text-white" />
                      <p className="text-white text-sm font-semibold">{formatEuro(totalAmount)}</p>
                    </div>
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  </div>
                </button>
              </div>
            )}

            {isInfoCollapsed && isPersonalInfoComplete && (
              <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4">
                <button onClick={handleExpandInfo} className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-white" />
                      <p className="text-white text-sm font-semibold">{identityDisplay}</p>
                    </div>
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  </div>
                </button>
              </div>
            )}

            <div 
              ref={paymentCardRef}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8"
            >
              <div className="space-y-6 relative z-20">
                <h2 className="text-xl font-bold text-white text-center">
                  Votre paiement securise
                </h2>

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
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Thank You */}
        <div 
          ref={thankYouRef}
          className="snap-center w-full px-4 flex items-center justify-center"
          style={{ height: "calc(100vh - env(safe-area-inset-top) - 3rem)" }}
        >
          <div className="w-full max-w-2xl">
            <div className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-5 md:p-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4 relative z-20">
                <div className="text-center space-y-2">
                  <h1 className="text-[24px] md:text-[28px] font-semibold leading-tight text-white">
                    Merci pour votre don
                  </h1>
                  <p className="text-white/80 text-[14px]">
                    QuAllah accepte votre sadaqa
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left space-y-3">
                  <div className="space-y-1">
                    <div className="text-[14px] font-medium text-white">Partager une demande de duaa</div>
                    <div className="text-[12px] text-white/65">Exprimez une intention pour laquelle vous souhaitez invoquer Allah.</div>
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
                  {feedback ? <div className="text-[13px] text-emerald-200">{feedback}</div> : null}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={goToDuaas}
                      className="text-[14px] text-white/70 hover:text-white transition-colors underline underline-offset-2"
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
    </div>
  );
}

