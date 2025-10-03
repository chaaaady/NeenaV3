"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SideMenu } from "@/components";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { HeaderSecondary } from "@/components/headers/HeaderSecondary";
import { useMiniHeaderTrigger } from "@/hooks/useMiniHeaderTrigger";
import CurrentPrayerSection from "@/components/CurrentPrayerSection";
import CurrentTimeSection from "@/components/CurrentTimeSection";
import { MapPin, Check, Car, Users, Accessibility, Info, CreditCard, User, Globe, Book } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilV8Page() {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]" />
    }>
      <MosqueCreteilV8Content />
    </Suspense>
  );
}

// Hook to get dynamic background based on current prayer time
function usePrayerBackground(slug?: string, url?: string) {
  const [currentPrayer, setCurrentPrayer] = useState<string>("Isha");
  const [timings, setTimings] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const qs = new URLSearchParams();
        if (slug) qs.set("slug", slug);
        if (url) qs.set("url", url);
        qs.set("t", Date.now().toString());
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json = await res.json();
        if (!json.ok || !json.timings) return;
        if (!cancelled) setTimings(json.timings);
      } catch {
        // Ignore errors
      }
    })();
    return () => { cancelled = true; };
  }, [slug, url]);

  useEffect(() => {
    if (!timings) return;

    const toMinutes = (time: string): number => {
      const [h, m] = (time || "").split(":").map((x) => parseInt(x || "0", 10));
      return Math.max(0, (h || 0) * 60 + (m || 0));
    };

    const selectTime = (p: any): string => {
      if (!p) return "";
      if (typeof p === "string") return String(p);
      return (p.adhan && p.adhan.trim()) || (p.iqama && p.iqama.trim()) || "";
    };

    // Inclure Jumua dans la liste des prières
    const prayers = ["Fajr", "Dhuhr", "Jumua", "Asr", "Maghrib", "Isha"];
    const points = prayers
      .map((k) => ({ key: k, at: selectTime(timings[k] ?? null), min: toMinutes(selectTime(timings[k] ?? null)) }))
      .filter((x) => x.at)
      .sort((a, b) => a.min - b.min);

    if (!points.length) return;

    const now = new Date();
    const nowM = now.getHours() * 60 + now.getMinutes();

    let current = points[points.length - 1].key; // Default to Isha
    for (let i = 0; i < points.length; i++) {
      if (points[i].min <= nowM) current = points[i].key;
    }

    setCurrentPrayer(current);
  }, [timings]);

  // Prayer-specific backgrounds - adaptés aux photos de chaque prière
  const backgrounds = {
    Fajr: "bg-gradient-to-b from-[#2d1b4e] via-[#8b4789] to-[#d97d54]", // Aube: violet profond → rose → orange (comme sobh.png)
    Dhuhr: "bg-gradient-to-b from-[#3d6f8f] via-[#4a7a93] to-[#568a95]", // Midi: bleu plus foncé avec dégradé léger
    Jumua: "bg-gradient-to-b from-[#3d6f8f] via-[#4a7a93] to-[#568a95]", // Vendredi midi: même fond que Dhuhr (même photo)
    Asr: "bg-gradient-to-b from-[#f4a460] via-[#e8935e] to-[#d4785a]", // Après-midi: doré/orange chaud
    Maghrib: "bg-gradient-to-b from-[#ff6b6b] via-[#ee5a24] to-[#8b4789]", // Coucher: rouge/orange → violet
    Isha: "bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f1f]", // Nuit: bleu nuit très sombre
  };

  const themeColors = {
    Fajr: "#2d1b4e",    // Violet profond de l'aube
    Dhuhr: "#3d6f8f",   // Bleu foncé
    Jumua: "#3d6f8f",   // Même que Dhuhr
    Asr: "#f4a460",     // Orange doré
    Maghrib: "#ff6b6b", // Rouge du coucher
    Isha: "#0a0a1a",    // Bleu nuit très sombre
  };

  return {
    background: backgrounds[currentPrayer as keyof typeof backgrounds] || backgrounds.Isha,
    themeColor: themeColors[currentPrayer as keyof typeof themeColors] || themeColors.Isha,
    currentPrayer,
  };
}

function MosqueCreteilV8Content() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useSearchParams();
  const { visible: miniVisible } = useMiniHeaderTrigger("hero-v8");

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

  // Dynamic background based on current prayer
  const { background, themeColor: prayerThemeColor, currentPrayer } = usePrayerBackground(mawaqitSlug, mawaqitUrl);
  
  // Augmenter le blur pour les prières avec photos claires (meilleure lisibilité)
  const needsExtraBlur = ["Fajr", "Dhuhr", "Jumua", "Asr"].includes(currentPrayer);
  const glassBlurClass = needsExtraBlur ? "backdrop-blur-xl" : "backdrop-blur-md";

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = prayerThemeColor;
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
  }, [prayerThemeColor]);

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <HeaderSecondary title={MOSQUE_NAME} visible={miniVisible} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={`relative w-full min-h-[100svh] ${background}`}>
        {/* Dynamic background based on current prayer time */}
        
        <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6 max-w-3xl mx-auto">
          {/* Hero Card */}
          <div id="hero-v8" className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
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
                href="/step-amount-v2" 
                className="flex-1 flex items-center justify-center gap-2 h-11 px-4 text-gray-900 bg-white hover:bg-white/90 rounded-2xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <CreditCard size={16} />
                Faire un don
              </a>
            </div>
          </div>

          {/* Current Prayer Card */}
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
            <CurrentPrayerSection slug={mawaqitSlug} url={mawaqitUrl} embedded />
            <CurrentTimeSection embedded />
          </div>

          {/* Prayer Times Card */}
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
            <h2 className="text-[18px] font-[800] text-white">Horaires de prière</h2>
            <PrayerTimesCard slug={mawaqitSlug} url={mawaqitUrl} />
          </div>

          {/* Jumu'a Card */}
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
            <h2 className="text-[18px] font-[800] text-white">Jumu&apos;a</h2>
            <JumaaCard slug={mawaqitSlug} url={mawaqitUrl} />
          </div>

          {/* Practical Info Card */}
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
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
                      {typeof row.value === 'boolean' ? (row.value ? <Check size={16} className="text-emerald-400 inline-block" /> : '—') : row.value}
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

          {/* Volunteering Card */}
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
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

          {/* About Neena Card */}
          <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/35 to-white/20 ${glassBlurClass} shadow-2xl p-6 md:p-7`}>
            <p className="text-[12.5px] text-white/80 leading-snug">
              Neena est une association à but non lucratif. Notre mission est d&apos;assurer la transition digitale des mosquées et d&apos;aider à mieux informer leurs fidèles.
              Nous ne prélevons aucune commission sur les dons et nous ne facturons aucun frais à la mosquée.
            </p>
          </div>

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
function PrayerTimesCard({ slug, url }: { slug?: string; url?: string }) {
  const [timings, setTimings] = useState<any>(null);
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

  const prayers = [
    { name: "Fajr", data: timings.Fajr },
    { name: "Dhuhr", data: timings.Dhuhr },
    { name: "Asr", data: timings.Asr },
    { name: "Maghrib", data: timings.Maghrib },
    { name: "Isha", data: timings.Isha },
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
        const adhan = p.data?.adhan ? String(p.data.adhan).trim() : "—";
        const iqama = p.data?.iqama ? String(p.data.iqama).trim() : "—";
        
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
  const [jumaaData, setJumaaData] = useState<any>(null);
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

  const adhan = jumaaData?.adhan ? String(jumaaData.adhan).trim() : "13:30";
  const iqama = jumaaData?.iqama ? String(jumaaData.iqama).trim() : "14:10";

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
      <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-[12px] text-yellow-200">
        Merci de ne pas gêner le voisinage et de vous garer sur des places appropriées.
      </div>
    </div>
  );
}

