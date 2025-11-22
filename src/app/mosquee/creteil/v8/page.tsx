"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SideMenu, HeaderMosquee } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MapPin, Check, Car, Users, Accessibility, Info, CreditCard, User, Globe, Book } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";
import { PrayerProgressCard } from "@/components/prayer/PrayerProgressCard";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilV8Page() {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]" />
    }>
      <MosqueCreteilV8Content />
    </Suspense>
  );
}

function MosqueCreteilV8Content() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useSearchParams();
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string> | null>(null);

  // Hero image (configurable via ?img=...)
  const heroImages = useMemo(() => {
    const url = params.get("img");
    return [url || "/hero-creteil.png", "/hero-creteil-2.png"]; 
  }, [params]);

  const [slide, setSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => {
      if (!isHeroPaused) setSlide((s) => (s + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [heroImages.length, isHeroPaused]);

  // Mawaqit slug/url (override via query if needed)
  const mawaqitSlug = (params.get("slug") || "mosquee-sahaba-creteil").trim();
  const mawaqitUrl = params.get("url") || undefined;

  const glassBlurClass = "backdrop-blur-xl";

  // Déterminer la prière actuelle et le background correspondant
  const currentPrayer = useCurrentPrayer(mawaqitSlug);
  
  const PRAYER_BACKGROUNDS: Record<string, { image: string; flip: boolean; statusBarColor: string }> = {
    fajr: { image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
    dhuhr: { image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
    asr: { image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
    maghrib: { image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
    isha: { image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
  };
  
  const currentBackground = PRAYER_BACKGROUNDS[currentPrayer] || PRAYER_BACKGROUNDS.fajr;

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

  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("hero-v8");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setShowStickyHeader(rect.bottom <= 0);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Header sticky qui apparaît au scroll (desktop) */}
      <div className={`fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <HeaderMosquee wide glass glassTone="light" onMenuClick={() => setIsMenuOpen(true)} mosqueeSlug="creteil" />
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug="creteil" />

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

        {/* Bouton Donner + Burger menu mobile en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Bouton Donner mobile (visible au scroll) */}
          <a 
            href="/step-amount-v20"
            className={`md:hidden px-3 py-1.5 bg-white text-gray-900 hover:bg-white/90 rounded-lg font-semibold text-[13px] transition-all shadow-lg ${
              showStickyHeader ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            Donner
          </a>
          
          {/* Burger menu mobile */}
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
        
        <main className="relative px-4 pb-12 pt-20 md:px-6 max-w-3xl mx-auto">
          {/* Hero Card */}
          <div id="hero-v8" className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
            {/* Hero Image Carousel */}
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
                  alt={MOSQUE_NAME}
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className={"object-cover absolute inset-0 transition-opacity duration-700 pointer-events-none " + (slide === i ? "opacity-100 z-10" : "opacity-0 z-0")}
                />
              ))}
              <div className="absolute bottom-2 right-2 flex gap-1 bg-white/60 backdrop-blur-sm rounded-full px-2 py-1">
                {heroImages.map((_, i) => (
                  <span key={i} className={"w-2 h-2 rounded-full transition-all " + (slide === i ? "bg-gray-800" : "bg-gray-400/60")} />
                ))}
              </div>
            </div>

            {/* Title/Address */}
            <div>
              <h1 className="text-[20px] font-[800] text-white leading-tight">{MOSQUE_NAME}</h1>
              <div className="mt-1 text-[13px] text-white/80 flex items-center gap-1">
                <MapPin size={14} />
                <span>{MOSQUE_ADDRESS}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-11 px-4 text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl border border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <MapPin size={16} />
                Itinéraire
              </a>
              <a 
                href="/step-amount-v20" 
                className="flex-1 flex items-center justify-center gap-2 h-11 px-4 text-gray-900 bg-white hover:bg-white/90 rounded-2xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <CreditCard size={16} />
                Faire un don
              </a>
            </div>
          </div>

          {/* Prayer Progress Card */}
          <ScrollReveal delay={0}>
            <div className="mt-4">
              <PrayerProgressCard mosqueeSlug={mawaqitSlug} prayerTimes={prayerTimes} />
            </div>
          </ScrollReveal>

          {/* Prayer Times Card */}
          <ScrollReveal delay={100}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Horaires de prière</h2>
              <PrayerTimesCard slug={mawaqitSlug} url={mawaqitUrl} onTimesLoaded={setPrayerTimes} />
            </div>
          </ScrollReveal>

          {/* Jumu'a Card */}
          <ScrollReveal delay={200}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Jumu&apos;a</h2>
              <JumaaCard slug={mawaqitSlug} url={mawaqitUrl} />
            </div>
          </ScrollReveal>

          {/* Practical Info Card */}
          <ScrollReveal delay={300}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Informations pratiques</h2>
            <div>
              {[
                { icon: Car, label: "Parking", value: true },
                { icon: User, label: "Espace femmes", value: true },
                { icon: Users, label: "Capacité mosquée", value: "200 personnes" },
                { icon: Accessibility, label: "Accès handicapé", value: true },
                { icon: Globe, label: "Cours d'arabe", value: true },
                { icon: Book, label: "Cours de religion", value: true },
              ].map((row) => {
                const IconComp = row.icon as LucideIcon;
                return (
                  <div key={row.label} className="relative flex items-center w-full px-1 py-2.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <IconComp size={16} className="text-white/70" />
                      <span className="text-[14px] font-[700] text-white truncate">{row.label}</span>
                    </div>
                    <div className="w-[128px] text-[14px] font-[700] text-white text-right truncate">
                      {typeof row.value === 'boolean' ? (row.value ? <Check size={16} className="text-white inline-block" /> : '—') : row.value}
                    </div>
                  </div>
                );
              })}
              {/* Legal Info */}
              <div className="relative flex items-center w-full px-1 py-2.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Info size={16} className="text-white/70" />
                  <span className="text-[14px] font-[700] text-white truncate">Informations légales</span>
                </div>
                <div className="w-[128px] text-right">
                  <a href="https://www.associations.gouv.fr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm px-2 py-[2px] text-[12px] text-white hover:bg-white/25 transition-all">Voir</a>
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Volunteering Card */}
          <ScrollReveal delay={400}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              <h2 className="text-[18px] font-[800] text-white">Bénévolat</h2>
              <div className="w-full rounded-2xl overflow-hidden h-[230px] relative">
                <Image src="/benevolat.png" alt="Bénévolat RAM 94" fill className="object-cover" />
              </div>
              <p className="text-[12.5px] text-white/80 leading-snug">Rejoignez l&apos;équipe pour soutenir l&apos;organisation des prières, Jumu&apos;a et événements.</p>
              <div className="flex justify-end">
                <a href="/benevolat" className="inline-flex items-center gap-2 h-10 px-4 text-gray-900 bg-white hover:bg-white/90 rounded-2xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  Devenir bénévole
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* About Neena Card */}
          <ScrollReveal delay={500}>
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
              <p className="text-[12.5px] text-white/80 leading-snug">
                Neena est une association à but non lucratif. Notre mission est d&apos;assurer la transition digitale des mosquées et d&apos;aider à mieux informer leurs fidèles.
                Nous ne prélevons aucune commission sur les dons et nous ne facturons aucun frais à la mosquée.
              </p>
            </div>
          </ScrollReveal>

          {/* Footer */}
          <div className="mt-6 px-4 py-6 border-t border-white/20 text-[12px] text-white/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md rounded-2xl">
            <span>© {new Date().getFullYear()} Mosquée de Créteil</span>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
              <a href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="/a-propos" className="hover:text-white transition-colors">Qui sommes-nous ?</a>
              <a href="/contact" className="hover:text-white transition-colors">Nous contacter</a>
              <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Prayer Times Card Component (copied from original)
function PrayerTimesCard({ slug, url, onTimesLoaded }: { slug?: string; url?: string; onTimesLoaded?: (times: Record<string, string>) => void }) {
  const [timings, setTimings] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const params = new URLSearchParams();
        if (slug) params.set("slug", slug);
        if (url) params.set("url", url);
        params.set("mode", "playwright"); // Force Playwright mode for accurate scraping
        params.set("force", "1"); // Force refresh cache
        params.set("t", Date.now().toString());
        const res = await fetch(`/api/mawaqit?${params.toString()}`, { cache: "no-store" });
        const json = await res.json();
        
        // Check if we have timings data
        if (json && json.ok && json.timings) {
          setTimings(json.timings);
          
          // Extract prayer times (adhan) and pass to parent
          if (onTimesLoaded) {
            const times: Record<string, string> = {};
            const timingsObj = json.timings as Record<string, unknown>;
            
            // Extract adhan time for each prayer
            ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
              if (timingsObj[prayer]) {
                const prayerData = timingsObj[prayer] as Record<string, unknown>;
                times[prayer] = prayerData.adhan ? String(prayerData.adhan).trim() : '';
              }
            });
            
            console.log('Extracted prayer times for progress card:', times);
            onTimesLoaded(times);
          }
        } else {
          console.warn("No timings data received:", json);
          setTimings(null);
        }
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setTimings(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTimes();
  }, [slug, url]);

  if (loading) return <div className="text-white/80">Chargement...</div>;
  if (!timings) return <div className="text-white/80">Indisponible</div>;

  const extractTimes = (data: unknown): { adhan: string; iqama: string } => {
    if (!data || typeof data !== "object") return { adhan: "—", iqama: "—" };
    const obj = data as Record<string, unknown>;
    return {
      adhan: obj.adhan ? String(obj.adhan).trim() : "—",
      iqama: obj.iqama ? String(obj.iqama).trim() : "—"
    };
  };

  const prayers = [
    { name: "Fajr", ...extractTimes(timings.Fajr) },
    { name: "Dhuhr", ...extractTimes(timings.Dhuhr) },
    { name: "Asr", ...extractTimes(timings.Asr) },
    { name: "Maghrib", ...extractTimes(timings.Maghrib) },
    { name: "Isha", ...extractTimes(timings.Isha) },
  ];

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-[13px] font-[600] text-white/70">Prière</span>
        <div className="flex items-center gap-8">
          <span className="text-[13px] font-[600] text-white/70 w-12 text-center">Adhan</span>
          <span className="text-[13px] font-[600] text-white/70 w-12 text-center">Iqama</span>
        </div>
      </div>
      
      {/* Prayer Rows */}
      {prayers.map((p) => {
        const adhan = p.adhan;
        const iqama = p.iqama;
        
        return (
          <div key={p.name} className="flex items-center justify-between px-1 py-1">
            <span className="text-[14px] font-[700] text-white">{p.name}</span>
            <div className="flex items-center gap-8">
              <span className="text-[14px] font-[600] text-white/90 w-12 text-center tabular-nums">{adhan}</span>
              <span className="text-[14px] font-[700] text-white w-12 text-center tabular-nums">{iqama}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Jumu'a Card Component (copied from original)
function JumaaCard({ slug, url }: { slug?: string; url?: string }) {
  const [jumaaData, setJumaaData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchJumuaTimes = async () => {
      try {
        setLoading(true);
        const qs = new URLSearchParams();
        if (slug) qs.set("slug", slug);
        if (url) qs.set("url", url);
        qs.set("t", Date.now().toString());
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json = await res.json();
        
        if (!cancelled && json.ok && json.timings?.Jumua) {
          setJumaaData(json.timings.Jumua);
        }
      } catch (err) {
        console.error("Error fetching Jumua times:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchJumuaTimes();
    return () => { cancelled = true; };
  }, [slug, url]);

  if (loading) return <div className="text-white/80">Chargement...</div>;

  const extractJumuaTime = (data: Record<string, unknown> | null, field: string, fallback: string): string => {
    if (!data) return fallback;
    const value = data[field];
    return value ? String(value).trim() : fallback;
  };

  const adhan = extractJumuaTime(jumaaData, "adhan", "13:30");
  const iqama = extractJumuaTime(jumaaData, "iqama", "14:10");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 py-2">
        <span className="text-[14px] font-[700] text-white">Adhan</span>
        <span className="text-[14px] font-[700] text-white tabular-nums">{adhan}</span>
      </div>
      <div className="flex items-center justify-between px-1 py-2">
        <span className="text-[14px] font-[700] text-white">Iqama</span>
        <span className="text-[14px] font-[700] text-white tabular-nums">{iqama}</span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-[14px] font-[600] text-white/80">Nombre de khutbas</span>
          <span className="text-[14px] font-[700] text-white">2</span>
        </div>
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-[14px] font-[600] text-white/80">Langues</span>
          <span className="text-[14px] font-[700] text-white">Français, Arabe</span>
        </div>
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-[14px] font-[600] text-white/80">Durée estimée</span>
          <span className="text-[14px] font-[700] text-white">30 min</span>
        </div>
      </div>
      <div className="mt-3 p-3 rounded-xl bg-white/10 border border-white/20 text-[12px] text-white/90">
        Merci de ne pas gêner le voisinage et de vous garer sur des places appropriées.
      </div>
    </div>
  );
}

