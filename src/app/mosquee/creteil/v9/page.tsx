"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { HeaderSecondary } from "@/components/headers/HeaderSecondary";
import { useMiniHeaderTrigger } from "@/hooks/useMiniHeaderTrigger";
import { MapPin, Check, TrendingUp, Building, Users, Heart, CreditCard, Target, Clock, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MOSQUE_NAME = "Future mosquée d'Ivry-sur-Seine";
const MOSQUE_ADDRESS = "Ivry-sur-Seine, Val-de-Marne";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

// Crowdfunding data
const GOAL_AMOUNT = 1200000;
const COLLECTED_AMOUNT = 785056;
const PERCENTAGE = Math.round((COLLECTED_AMOUNT / GOAL_AMOUNT) * 100);

export default function MosqueCreteilV9Page() {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]" />
    }>
      <MosqueCreteilV9Content />
    </Suspense>
  );
}

function MosqueCreteilV9Content() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useSearchParams();
  const { visible: miniVisible } = useMiniHeaderTrigger("hero-v9");
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);

  // Hero image (configurable via ?img=...)
  const heroImages = useMemo(() => {
    const url = params.get("img");
    return [url || "/hero-creteil.png"]; // Using Créteil image for now
  }, [params]);

  const [slide, setSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => {
      if (!isHeroPaused && heroImages.length > 1) setSlide((s) => (s + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [heroImages.length, isHeroPaused]);

  // Static blue background (same as step-payment)
  const background = "bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]";
  const glassBlurClass = "backdrop-blur-xl";

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5";
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

  // Animate percentage and amount on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
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
    { title: "Recherche du terrain", status: "completed", date: "2022" },
    { title: "Achat du terrain", status: "completed", date: "2023" },
    { title: "Permis de construire", status: "in-progress", date: "2024" },
    { title: "Début des travaux", status: "upcoming", date: "2025" },
    { title: "Ouverture", status: "upcoming", date: "2026" },
  ];

  // Format number with spaces
  const formatNumber = (num: number) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Calculate circumference for circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <HeaderSecondary title="Mosquée d'Ivry-sur-Seine" visible={miniVisible} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={`relative w-full min-h-[100svh] ${background}`}>
        <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+12px)] md:px-6 max-w-3xl mx-auto">
          {/* Hero Card */}
          <ScrollReveal>
          <div id="hero-v9" className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-5 md:p-6 space-y-2.5`}>
            {/* Hero Image */}
            <div
              className="w-full rounded-2xl overflow-hidden relative h-[180px]"
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
                  <Sparkles className="w-4 h-4 text-[#5a8bb5]" />
                  <span className="text-[#5a8bb5] text-sm font-semibold">Projet en cours</span>
                </div>
              </div>
            </div>

            {/* Title and Address */}
            <div className="space-y-0">
              <h1 className="text-lg font-bold text-white leading-tight">{MOSQUE_NAME}</h1>
              <div className="flex items-center gap-1.5 text-white/70 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span className="text-[12px]">{MOSQUE_ADDRESS}</span>
              </div>
            </div>

            {/* Progress Gauge - Circular Apple Style */}
            <div className="relative flex flex-col items-center justify-center py-3">
              <svg className="w-40 h-40 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-[2000ms] ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e8f0f8" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white">{Math.round(animatedPercentage)}%</div>
                <div className="text-[11px] text-white/70 mt-0.5">de l&apos;objectif</div>
              </div>
            </div>

            {/* Amount details */}
            <div className="grid grid-cols-2 gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-center">
                <div className="text-base font-bold text-white whitespace-nowrap">{formatNumber(animatedAmount)} €</div>
                <div className="text-[10px] text-white/70 mt-0.5">Montant collecté</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white whitespace-nowrap">{formatNumber(GOAL_AMOUNT)} €</div>
                <div className="text-[10px] text-white/70 mt-0.5">Objectif</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2.5">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium transition-all text-[13px]"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Localisation</span>
              </a>
              <a
                href="/step-amount-v2"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-white hover:bg-white/90 text-[#5a8bb5] font-medium transition-all shadow-lg text-[13px]"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Faire un don</span>
              </a>
            </div>
          </div>
          </ScrollReveal>

          {/* Timeline Section */}
          <ScrollReveal delay={100}>
          <div className={`mt-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white" />
              Avancement du projet
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-white/20"></div>
              
              {/* Timeline steps */}
              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    {/* Circle indicator */}
                    <div className="relative z-10">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-white/90 border-white' 
                          : step.status === 'in-progress'
                          ? 'bg-[#5a8bb5] border-[#6b9ec7] animate-pulse'
                          : 'bg-white/10 border-white/30'
                      }`}>
                        {step.status === 'completed' && <Check className="w-4 h-4 text-[#5a8bb5]" />}
                        {step.status === 'in-progress' && <Clock className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-semibold ${
                          step.status === 'completed' ? 'text-white' : 'text-white/70'
                        }`}>
                          {step.title}
                        </h3>
                        <span className="text-xs text-white/50">{step.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Project Vision */}
          <ScrollReveal delay={200}>
          <div className={`mt-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-white" />
              Un projet ambitieux pour notre communauté
            </h2>
            
            <div className="space-y-4 text-white/80">
              <p>
                La future mosquée d&apos;Ivry-sur-Seine sera un lieu de culte moderne et accueillant, 
                conçu pour répondre aux besoins spirituels et sociaux de notre communauté grandissante.
              </p>
              
              <div className="grid gap-3">
                <FeatureItem
                  icon={Users}
                  title="Capacité d'accueil"
                  description="Plus de 1500 fidèles pourront prier ensemble"
                />
                <FeatureItem
                  icon={Building}
                  title="Espaces multifonctionnels"
                  description="Salles de classe, bibliothèque et espaces communautaires"
                />
                <FeatureItem
                  icon={Target}
                  title="Architecture moderne"
                  description="Un design harmonieux qui s'intègre parfaitement au quartier"
                />
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Why Support */}
          <ScrollReveal delay={300}>
          <div className={`mt-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-white" />
              Pourquoi soutenir ce projet ?
            </h2>
            
            <div className="space-y-3">
              <ReasonCard
                title="Un investissement pour l'éternité"
                description="Chaque contribution participe à la construction d'un lieu de culte qui servira des générations"
              />
              <ReasonCard
                title="Renforcer notre communauté"
                description="Un espace dédié pour nos activités religieuses, éducatives et sociales"
              />
              <ReasonCard
                title="Transparence totale"
                description="Suivi en temps réel de l'utilisation des fonds et rapports réguliers"
              />
            </div>

            {/* Final CTA */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-white text-center mb-4">
                Ensemble, construisons un lieu de paix et de spiritualité
              </p>
              <a
                href="/step-amount-v2"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white hover:bg-white/90 text-[#5a8bb5] font-semibold transition-all shadow-lg"
              >
                <CreditCard className="w-5 h-5" />
                <span>Participer à la construction</span>
              </a>
            </div>
          </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={400}>
          <div className={`mt-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
            <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
            <div className="space-y-2 text-white/80">
              <p>Pour plus d&apos;informations sur le projet :</p>
              <p className="font-medium">Email: contact@mosqueedivry.fr</p>
              <p className="font-medium">Tél: 06 24 79 96 08</p>
            </div>
          </div>
          </ScrollReveal>
        </main>
      </div>
    </>
  );
}

// Helper Components
function FeatureItem({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-xs text-white/60 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function ReasonCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );
}
