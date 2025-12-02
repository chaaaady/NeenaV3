"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { MapPin, Check, X, Car, Users, Accessibility, Book, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SideMenu, HeaderMosquee, DesktopSidebar } from "@/components";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";
import { PrayerProgressCard } from "@/components/prayer/PrayerProgressCard";
import type { MosqueData, JumuaTime } from "@/types/mosque";
import { FEATURE_LABELS } from "@/lib/validations/mosque";

interface MosqueTemplateProps {
  data: MosqueData;
  jumuaTimes?: JumuaTime | null;
}

const PRAYER_BACKGROUNDS: Record<string, { image: string; flip: boolean; statusBarColor: string }> = {
  fajr: { image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
  dhuhr: { image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
  asr: { image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
  maghrib: { image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
  isha: { image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
};

export function MosqueTemplate({ data, jumuaTimes }: MosqueTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [slide, setSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string> | null>(null);

  const heroImages = data.assets.hero_images.length > 0 ? data.assets.hero_images : ['/hero-default.jpg'];
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.metadata.address)}`;
  
  // Déterminer la prière actuelle et le background correspondant
  const currentPrayer = useCurrentPrayer(data.configuration.mawaqit_slug);
  const currentBackground = PRAYER_BACKGROUNDS[currentPrayer] || PRAYER_BACKGROUNDS.fajr;

  // Carousel des images hero
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      if (!isHeroPaused) setSlide((s) => (s + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [heroImages.length, isHeroPaused]);

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

  // Sticky header on scroll
  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("hero-mosque");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setShowStickyHeader(rect.bottom <= 0);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glassBlurClass = "backdrop-blur-xl";

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Header sticky mobile */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <HeaderMosquee wide glass glassTone="light" onMenuClick={() => setIsMenuOpen(true)} mosqueeSlug={data.slug} />
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug={data.slug} />

      <div className="relative w-full min-h-[100svh]">
        {/* Background image dynamique */}
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
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Logo Neena mobile */}
        <div className="absolute top-0 left-0 z-10 p-4 lg:hidden">
          <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px] drop-shadow-lg hover:opacity-80 transition-opacity">
            Neena
          </a>
        </div>

        {/* Bouton Donner + Burger menu mobile */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <a 
            href="/step-amount-v26"
            className={`md:hidden px-3 py-1.5 bg-white text-gray-900 hover:bg-white/90 rounded-lg font-semibold text-[13px] transition-all shadow-lg ${
              showStickyHeader ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            Donner
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
        
        {/* Main content */}
        <div className="lg:ml-64 lg:flex lg:justify-center lg:items-start lg:min-h-screen">
          <main className="relative px-4 pb-12 pt-20 md:px-6 max-w-3xl w-full mx-auto">
            {/* Hero Card */}
            <div id="hero-mosque" className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              {/* Hero Image Carousel */}
              {heroImages.length > 0 && (
                <div
                  className="w-full rounded-2xl overflow-hidden relative h-[260px]"
                  onMouseEnter={() => setIsHeroPaused(true)}
                  onMouseLeave={() => setIsHeroPaused(false)}
                  onTouchStart={() => setIsHeroPaused(true)}
                  onTouchEnd={() => setIsHeroPaused(false)}
                >
                  {heroImages.map((src, i) => (
                    <Image
                      key={src}
                      src={src}
                      alt={data.content.name}
                      fill
                      sizes="(max-width: 600px) 100vw, 600px"
                      className={"object-cover absolute inset-0 transition-opacity duration-700 pointer-events-none " + (slide === i ? "opacity-100 z-10" : "opacity-0 z-0")}
                    />
                  ))}
                  {heroImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex gap-1 bg-white/60 backdrop-blur-sm rounded-full px-2 py-1">
                      {heroImages.map((_, i) => (
                        <span key={i} className={"w-2 h-2 rounded-full transition-all " + (slide === i ? "bg-gray-800" : "bg-gray-400/60")} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Title/Address */}
              <div>
                <h1 className="text-[20px] font-[800] text-white leading-tight">{data.content.name}</h1>
                <div className="mt-1 text-[13px] text-white/80 flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{data.metadata.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white font-medium text-[14px] transition-all active:scale-[0.98]"
                >
                  <MapPin size={16} />
                  <span>Itinéraire</span>
                </a>
                <a
                  href="/step-amount-v26"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-white/90 text-gray-900 font-semibold text-[14px] transition-all active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  <span>Faire un don</span>
                </a>
              </div>
            </div>

            {/* Prayer Progress Card */}
            <div className="mt-4">
              <PrayerProgressCard 
                mosqueeSlug={data.configuration.mawaqit_slug}
                mawaqitUrl={data.configuration.mawaqit_url}
                onTimesLoaded={setPrayerTimes}
              />
            </div>

            {/* Prayer Times Card */}
            <MosquePrayerTimesCard 
              mawaqitSlug={data.configuration.mawaqit_slug}
              mawaqitUrl={data.configuration.mawaqit_url}
              glassBlurClass={glassBlurClass}
            />

            {/* Jumua Card */}
            {jumuaTimes && (
              <MosqueJumuaCard jumuaTimes={jumuaTimes} glassBlurClass={glassBlurClass} />
            )}

            {/* Practical Info Card */}
            <MosquePracticalInfoCard data={data} glassBlurClass={glassBlurClass} />

            {/* Volunteer Card */}
            {data.content.volunteer_description && (
              <MosqueVolunteerCard data={data} glassBlurClass={glassBlurClass} />
            )}

            {/* Footer */}
            <MosqueFooter mosqueName={data.content.name} />
          </main>
        </div>
      </div>
    </>
  );
}

// Sous-composants (à extraire dans des fichiers séparés si nécessaire)

function MosquePrayerTimesCard({ mawaqitSlug, mawaqitUrl, glassBlurClass }: { mawaqitSlug?: string; mawaqitUrl?: string; glassBlurClass: string }) {
  // Implémentation similaire à v8
  return (
    <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
      <h2 className="text-[18px] font-[700] text-white mb-4">Horaires de prière</h2>
      <div className="text-white/80">Chargement...</div>
    </div>
  );
}

function MosqueJumuaCard({ jumuaTimes, glassBlurClass }: { jumuaTimes: JumuaTime; glassBlurClass: string }) {
  return (
    <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
      <h2 className="text-[18px] font-[700] text-white mb-4">Jumu&apos;a</h2>
      <div className="space-y-2 text-white">
        <div>Khutba : {jumuaTimes.khutba_time}</div>
        <div>Salat : {jumuaTimes.salat_time}</div>
      </div>
    </div>
  );
}

function MosquePracticalInfoCard({ data, glassBlurClass }: { data: MosqueData; glassBlurClass: string }) {
  const features = data.features.map(f => ({
    icon: getFeatureIcon(f),
    label: FEATURE_LABELS[f],
    value: true,
  }));

  return (
    <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
      <h2 className="text-[18px] font-[700] text-white mb-4">Informations pratiques</h2>
      <div className="grid grid-cols-1 gap-3">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <feature.icon size={18} className="text-white/70" />
              <span className="text-white text-[14px]">{feature.label}</span>
            </div>
            {feature.value ? (
              <Check size={18} className="text-emerald-400" />
            ) : (
              <X size={18} className="text-white/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MosqueVolunteerCard({ data, glassBlurClass }: { data: MosqueData; glassBlurClass: string }) {
  return (
    <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
      <h2 className="text-[18px] font-[700] text-white mb-4">Bénévolat</h2>
      {data.assets.volunteer_image_url && (
        <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-4 relative">
          <Image
            src={data.assets.volunteer_image_url}
            alt="Bénévolat"
            fill
            className="object-cover"
          />
        </div>
      )}
      <p className="text-white/80 text-[14px] leading-relaxed mb-4">
        {data.content.volunteer_description}
      </p>
      <a
        href="/benevolat"
        className="inline-block px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold text-[14px] hover:bg-white/90 transition-all"
      >
        Devenir bénévole
      </a>
    </div>
  );
}

function MosqueFooter({ mosqueName }: { mosqueName: string }) {
  return (
    <div className="mt-8 space-y-4">
      <p className="text-white/60 text-[13px] leading-relaxed text-center">
        Neena est une association à but non lucratif. Notre mission est d&apos;assurer la transition digitale des mosquées et d&apos;aider à mieux informer leurs fidèles. Nous ne prélevons aucune commission sur les dons et nous ne facturons aucun frais à la mosquée.
      </p>
      <div className="flex flex-col items-center gap-2 text-white/50 text-[12px]">
        <div>© 2025 {mosqueName}</div>
        <div className="flex gap-4">
          <a href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
          <a href="/a-propos" className="hover:text-white transition-colors">Qui sommes-nous ?</a>
          <a href="/contact" className="hover:text-white transition-colors">Nous contacter</a>
        </div>
      </div>
    </div>
  );
}

function getFeatureIcon(feature: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    parking: Car,
    women_space: Users,
    disabled_access: Accessibility,
    arabic_courses: Book,
    religion_courses: Book,
    wudu_facilities: Info,
    library: Book,
    bookstore: Book,
    funeral_services: Info,
  };
  return icons[feature] || Info;
}

