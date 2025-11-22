"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MapPin, TrendingUp, Building, Users, Heart, CreditCard, Target, Clock, Sparkles } from "lucide-react";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";

const MOSQUE_NAME = "Future mosquée d'Ivry-sur-Seine";
const MOSQUE_ADDRESS = "Ivry-sur-Seine, Val-de-Marne";

// Crowdfunding data
const GOAL_AMOUNT = 1200000;
const COLLECTED_AMOUNT = 785056;
const PERCENTAGE = Math.round((COLLECTED_AMOUNT / GOAL_AMOUNT) * 100);

// Prayer backgrounds configuration
const PRAYER_BACKGROUNDS: Record<string, { image: string; flip: boolean; statusBarColor: string }> = {
  fajr: { image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
  dhuhr: { image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
  asr: { image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
  maghrib: { image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
  isha: { image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
};

export default function MosqueCreteilV9Page() {
  return (
    <Suspense fallback={<div className="relative w-full min-h-[100svh]" />}>
      <MosqueCreteilV9Content />
    </Suspense>
  );
}

function MosqueCreteilV9Content() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useSearchParams();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Hero image (configurable via ?img=...)
  const heroImages = useMemo(() => {
    const url = params.get("img");
    return [url || "/hero-creteil.png"];
  }, [params]);

  const [slide, setSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => {
      if (!isHeroPaused && heroImages.length > 1) setSlide((s) => (s + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [heroImages.length, isHeroPaused]);

  // Déterminer la prière actuelle et le background correspondant
  const currentPrayer = useCurrentPrayer("mosquee-sahaba-creteil");
  
  const currentBackground = useMemo(() => 
    PRAYER_BACKGROUNDS[currentPrayer] || PRAYER_BACKGROUNDS.fajr,
    [currentPrayer]
  );

  const glassBlurClass = "backdrop-blur-xl";

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = currentBackground.statusBarColor;
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
  }, [currentBackground.statusBarColor]);

  // Detect scroll for sticky header
  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("hero-v9");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setShowStickyHeader(rect.bottom <= 0);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate percentage and amount on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const percentageStep = PERCENTAGE / steps;
    const amountStep = COLLECTED_AMOUNT / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps) {
        currentStep++;
        setAnimatedPercentage(Math.min(currentStep * percentageStep, PERCENTAGE));
        setAnimatedAmount(Math.min(currentStep * amountStep, COLLECTED_AMOUNT));
      } else {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  // Timeline data
  const timelineSteps = [
    { title: "Achat du terrain", status: "completed", date: "2023" },
    { title: "Permis de construire", status: "in-progress", date: "2024" },
    { title: "Début des travaux", status: "upcoming", date: "2025" },
    { title: "Construction", status: "upcoming", date: "2025-2026" },
    { title: "Finitions", status: "upcoming", date: "2026" },
    { title: "Ouverture", status: "upcoming", date: "2026" },
  ];

  // Format number with spaces
  const formatNumber = (num: number) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Calculate circumference for circular progress (not used with progress bar)
  const _radius = 70;
  const _circumference = 2 * Math.PI * _radius;

  // Key features
  const features = [
    { icon: <Users className="w-5 h-5" />, label: "Capacité", value: "800 personnes" },
    { icon: <Building className="w-5 h-5" />, label: "Surface", value: "2 500 m²" },
    { icon: <Heart className="w-5 h-5" />, label: "Services", value: "École, bibliothèque" },
    { icon: <Target className="w-5 h-5" />, label: "Niveaux", value: "3 étages" },
    { icon: <MapPin className="w-5 h-5" />, label: "Parking", value: "150 places" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Architecture", value: "Moderne et écologique" },
  ];

  return (
    <>
      {/* Header sticky qui apparaît au scroll */}
      <div className={`fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto flex h-14 items-center justify-between px-4" style={{ maxWidth: 1280 }}>
            <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px]">
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
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="relative w-full min-h-[100svh]">
        {/* Background image dynamique selon la prière actuelle */}
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
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${currentBackground.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: currentBackground.flip ? 'scaleY(-1)' : 'none',
            }}
          />
          
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Logo Neena en haut de la page */}
        <div className="absolute top-0 left-0 z-10 p-4">
          <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px] drop-shadow-lg hover:opacity-80 transition-opacity">
            Neena
          </a>
        </div>

        {/* Burger menu mobile en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
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
        
        <main className="relative px-4 pb-24 pt-20 md:px-6 max-w-3xl mx-auto">
          {/* Hero Card */}
          <ScrollReveal delay={0}>
          <div id="hero-v9" className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
            {/* Hero Image */}
            <div
              className="w-full rounded-2xl overflow-hidden relative h-[200px]"
              onMouseEnter={() => setIsHeroPaused(true)}
              onMouseLeave={() => setIsHeroPaused(false)}
              onTouchStart={() => setIsHeroPaused(true)}
              onTouchEnd={() => setIsHeroPaused(false)}
            >
              {heroImages.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={MOSQUE_NAME}
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className={"object-cover absolute inset-0 transition-opacity duration-700 " + (slide === i ? "opacity-100 z-10" : "opacity-0 z-0")}
                />
              ))}
              {/* Overlay with project badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-900 text-[13px] font-[700]">Projet en cours</span>
                </div>
              </div>
            </div>

            {/* Title and Address */}
            <div>
              <h1 className="text-[20px] font-[800] text-white leading-tight">{MOSQUE_NAME}</h1>
              <div className="mt-1 text-[13px] text-white/80 flex items-center gap-1">
                <MapPin size={14} />
                <span>{MOSQUE_ADDRESS}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/80">Progression</span>
                <span className="text-[20px] font-[800] text-white">{Math.round(animatedPercentage)}%</span>
              </div>
              <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-white via-white/90 to-white/80 rounded-full transition-all duration-[2000ms] ease-out"
                  style={{ width: `${animatedPercentage}%` }}
                />
              </div>
            </div>

            {/* Amount details */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-center">
                <div className="text-[16px] font-[700] text-white whitespace-nowrap">{formatNumber(animatedAmount)} €</div>
                <div className="text-[11px] text-white/70 mt-0.5">Collecté</div>
              </div>
              <div className="text-center">
                <div className="text-[16px] font-[700] text-white whitespace-nowrap">{formatNumber(GOAL_AMOUNT)} €</div>
                <div className="text-[11px] text-white/70 mt-0.5">Objectif</div>
              </div>
            </div>

            {/* CTA Button */}
              <a
              href="/step-amount-v20"
              className="w-full flex items-center justify-center gap-2 h-11 px-4 text-gray-900 bg-white hover:bg-white/90 rounded-2xl shadow-lg transition-all"
              >
              <CreditCard size={16} />
              Faire un don
              </a>
          </div>
          </ScrollReveal>

          {/* Timeline Section */}
          <ScrollReveal delay={100}>
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-3`}>
            <h2 className="text-[18px] font-[800] text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Avancement
            </h2>
            
            <div className="space-y-3">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${
                      step.status === "completed" ? "bg-white border-white" :
                      step.status === "in-progress" ? "bg-white/20 border-white" :
                      "bg-transparent border-white/30"
                      }`}>
                      {step.status === "completed" && <Clock className="w-4 h-4 text-gray-900" />}
                      {step.status === "in-progress" && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                      {step.status === "upcoming" && <div className="w-2 h-2 rounded-full bg-white/30" />}
                      </div>
                    {idx < timelineSteps.length - 1 && (
                      <div className={`w-0.5 h-10 mt-2 ${
                        step.status === "completed" ? "bg-white" : "bg-white/20"
                      }`} />
                    )}
                    </div>
                    
                  {/* Timeline content */}
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-[15px] font-[700] ${
                        step.status === "upcoming" ? "text-white/60" : "text-white"
                      }`}>{step.title}</h3>
                      <span className={`text-[13px] font-[600] ${
                        step.status === "upcoming" ? "text-white/40" : "text-white/70"
                      }`}>{step.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Features */}
          <ScrollReveal delay={200}>
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-3`}>
            <h2 className="text-[18px] font-[800] text-white">Détails</h2>

            <div className="grid grid-cols-1 gap-2.5">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] text-white/70">{feature.label}</div>
                    <div className="text-[15px] font-[700] text-white">{feature.value}</div>
                  </div>
              </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* CTA Final */}
          <ScrollReveal delay={300}>
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
            <a
              href="/step-amount-v20"
              className="w-full flex items-center justify-center gap-2 h-12 px-4 text-gray-900 bg-white hover:bg-white/90 rounded-2xl shadow-lg transition-all font-[700] text-[15px]"
              >
              <CreditCard size={18} />
              Faire un don
              </a>
          </div>
          </ScrollReveal>

        </main>
      </div>
    </>
  );
}
