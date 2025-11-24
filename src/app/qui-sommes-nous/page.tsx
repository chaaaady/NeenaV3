"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { SideMenu, DesktopSidebar } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Globe, Smartphone, Heart, CreditCard, QrCode, Zap, Check, ArrowRight } from "lucide-react";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";

// Prayer backgrounds configuration
const PRAYER_BACKGROUNDS: Record<string, { image: string; flip: boolean; statusBarColor: string }> = {
  fajr: { image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
  dhuhr: { image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
  asr: { image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
  maghrib: { image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
  isha: { image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
};

export default function QuiSommesNousPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Déterminer la prière actuelle et le background correspondant
  const currentPrayer = useCurrentPrayer("mosquee-sahaba-creteil");
  
  const currentBackground = useMemo(() => 
    PRAYER_BACKGROUNDS[currentPrayer] || PRAYER_BACKGROUNDS.fajr,
    [currentPrayer]
  );

  const glassBlurClass = "backdrop-blur-xl";

  // Set theme-color for iPhone notch - dynamically based on current prayer
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

  // Detect scroll for sticky header - apparaît dès qu'on scroll
  useEffect(() => {
    const onScroll = () => {
      setShowStickyHeader(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Site web professionnel",
      description: "Un site moderne et responsive pour votre mosquée"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Hébergement gratuit",
      description: "Infrastructure sécurisée prise en charge"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Formulaires de don",
      description: "Collectez facilement en ligne"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Connexion Stripe",
      description: "Paiements sécurisés intégrés"
    },
    {
      icon: <QrCode className="w-5 h-5" />,
      title: "QR Codes physiques",
      description: "Augmentez votre portée de collecte"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Sans commission",
      description: "100% de vos dons pour votre mosquée"
    }
  ];

  const advantages = [
    "Aucun frais d'installation ou maintenance",
    "Aucune commission sur les dons",
    "Hébergement et sécurité inclus",
    "Support technique gratuit",
    "Conformité RGPD garantie",
    "QR codes fournis gratuitement"
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Header sticky qui apparaît au scroll (mobile only) */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
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

        {/* Logo Neena en haut de la page (scroll avec le contenu) */}
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

        {/* Contenu principal */}
        {/* Wrapper pour centrer le contenu entre le sidebar et le bord droit */}
        <div className="lg:ml-64 lg:flex lg:justify-center lg:items-start lg:min-h-screen">
          <main className="relative px-4 pb-24 pt-20 md:px-6 max-w-3xl w-full mx-auto">
          
          {/* Hero Card avec Image */}
          <ScrollReveal delay={0}>
            <div id="hero-neena" className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl overflow-hidden`}>
              {/* Image Hero */}
              <div className="relative w-full h-[240px] md:h-[280px]">
                <Image 
                  src="/hero-creteil.png"
                  alt="Mosquée de Créteil" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
              </div>

              {/* Contenu Hero */}
              <div className="p-6 md:p-7 space-y-4">
                <h1 className="text-[24px] md:text-[28px] font-[800] text-white leading-tight">
                  Digitalisez votre mosquée avec Neena
                </h1>
                <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed">
                  Nous aidons les mosquées à moderniser leur présence en ligne et à optimiser leurs collectes de dons, 
                  <span className="text-white font-[700]"> gratuitement et sans commission</span>.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Notre Mission */}
          <ScrollReveal delay={100}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Notre mission</h2>
              <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed">
                Neena est une plateforme dédiée à la digitalisation des mosquées en France. 
                Notre objectif est de faciliter la gestion en ligne des mosquées et d&apos;augmenter leurs capacités de collecte 
                grâce à des outils modernes, tout en garantissant une transparence totale et sans aucune commission.
              </p>
            </div>
          </ScrollReveal>

          {/* Ce que nous offrons */}
          <ScrollReveal delay={200}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Ce que nous offrons</h2>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                      <h3 className="text-white font-[700] text-[15px] mb-1 leading-tight">{feature.title}</h3>
                      <p className="text-white/70 text-[13px] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Avantages */}
          <ScrollReveal delay={300}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Pourquoi choisir Neena ?</h2>
            
              <div className="space-y-3">
                {advantages.map((avantage, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border border-white/30 bg-white/15 backdrop-blur-md flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                  </div>
                    <p className="text-white text-[14px]">{avantage}</p>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* CTA Final */}
          <ScrollReveal delay={400}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">
              Prêt à moderniser votre mosquée ?
            </h2>
              <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed">
              Rejoignez les mosquées qui ont déjà fait confiance à Neena pour digitaliser leur présence 
              et augmenter leurs collectes de manière transparente et efficace.
            </p>
            
              <div className="space-y-3">
              <button 
                  onClick={() => window.location.href = 'mailto:contact@neena.fr?subject=Contact%20Neena'}
                  className="w-full px-6 py-3 bg-white hover:bg-white/90 text-gray-900 font-[700] text-[15px] rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Nous contacter
                  <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.location.href = '/mosquee/creteil/v8'}
                  className="w-full px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-[600] text-[15px] rounded-2xl backdrop-blur-md transition-all flex items-center justify-center"
                >
                  Exemple : Page mosquée
                </button>
                <button 
                  onClick={() => window.location.href = '/mosquee/creteil/v9'}
                  className="w-full px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-[600] text-[15px] rounded-2xl backdrop-blur-md transition-all flex items-center justify-center"
                >
                  Exemple : Projet de construction
                </button>
                <button 
                  onClick={() => window.location.href = '/step-amount-v20'}
                  className="w-full px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-[600] text-[15px] rounded-2xl backdrop-blur-md transition-all flex items-center justify-center"
                >
                  Exemple : Formulaire de don
                </button>
                <button 
                  onClick={() => window.location.href = '/zakat-fitr-creteil'}
                  className="w-full px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-[600] text-[15px] rounded-2xl backdrop-blur-md transition-all flex items-center justify-center"
              >
                  Exemple : Page spécifique (Zakat al-Fitr)
                </button>
                <button 
                  onClick={() => window.location.href = '/qurbani'}
                  className="w-full px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-[600] text-[15px] rounded-2xl backdrop-blur-md transition-all flex items-center justify-center"
                >
                  Exemple : Page spécifique (Qurbani)
              </button>
            </div>
          </div>
          </ScrollReveal>

        </main>
        </div>
      </div>
    </>
  );
}
