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
import { MapPin, Check, X, Car, Users, Accessibility, Clock, Info, CreditCard, User, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;
// Associations (kept in content via links; constants removed to avoid unused)

export default function MosqueCreteilPage() {
  return (
    <Suspense fallback={<div />}> 
      <MosqueCreteilContent />
    </Suspense>
  );
}

function MosqueCreteilContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_newsletterEmail, _setNewsletterEmail] = useState("");
  const [_heroInView, setHeroInView] = useState(true);
  const params = useSearchParams();
  const [_hasScrolled, setHasScrolled] = useState(false);
  const { visible: miniVisible } = useMiniHeaderTrigger("next-prayer");

  // Hero image (configurable via ?img=...)
  const heroImages = useMemo(() => {
    const url = params.get("img");
    // If a single image is provided via query, use it as the first slide
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

  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setHeroInView(entry.isIntersecting);
      },
      { root: null, threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Global header rendered inline inside hero (sticky within hero only) */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {/* Header principal (section pleine largeur, non sticky) */}
      <HeaderPrimary onMenuClick={() => setIsMenuOpen(true)} />
      {/* Lorsque le mini-header apparaît, il se place tout en haut (top:0) et remplace visuellement le premier */}
      <HeaderSecondary title={MOSQUE_NAME} visible={miniVisible} />

      <div className="app-container pb-24" style={{ paddingTop: 0, paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
        {/* Hero */}
        <div className="app-card">
          <div className="space-y-3">
            <div
              ref={heroRef}
              className="w-full rounded-12 overflow-hidden border border-[var(--border)] relative h-[260px]"
              onMouseEnter={() => setIsHeroPaused(true)}
              onMouseLeave={() => setIsHeroPaused(false)}
              onTouchStart={() => setIsHeroPaused(true)}
              onTouchEnd={() => setIsHeroPaused(false)}
            >
              {/* Removed inline copy of global header to avoid conflicts */}
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
              <div className="absolute bottom-2 right-2 flex gap-1 bg-white/60 rounded-full px-2 py-1">
                {heroImages.map((_, i) => (
                  <span key={i} className={"w-2 h-2 rounded-full " + (slide === i ? "bg-[var(--text)]" : "bg-[var(--text-muted)]/60")} />
                ))}
              </div>
            </div>
            {/* Title/address under the image */}
            <div className="px-1">
              <div className="text-[20px] font-[800] text-[var(--text)] leading-tight">{MOSQUE_NAME}</div>
              <div className="mt-1 text-[13px] text-[var(--text-muted)] flex items-center gap-1">
                <MapPin size={14} />
                <span>{MOSQUE_ADDRESS}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary pressable flex-1 flex items-center justify-center gap-2 py-3 h-11"
              >
                <MapPin size={16} />
                Itinéraire
              </a>
              <a href="/step-amount-v2" className="pressable flex-1 flex items-center justify-center gap-2 h-11 px-4 text-white bg-[#0E3B2E] hover:bg-[#0C3528] rounded-[12px]">
                <CreditCard size={16} />
                Faire un don
              </a>
            </div>
          </div>
        </div>

        {/* Next Prayer (déclencheur du mini-header) */}
        <div id="next-prayer" className="app-card mt-4">
          <div className="space-y-4">
            {/* Put the countdown/title first so it acts as the card title */}
            <CurrentPrayerSection slug={mawaqitSlug} url={mawaqitUrl} embedded />
            <CurrentTimeSection embedded />
          </div>
        </div>

        {/* Next Prayer section removed */}

        {/* Horaires (API interne) — DS primitives */}
        <div className="app-card mt-4" id="horaires" data-observe-section data-section-title="Horaires de prière">
          <div className="app-title">Horaires de prière</div>
          <div className="mt-2">
            <PrayerTimesCard slug={mawaqitSlug} url={mawaqitUrl} />
          </div>
        </div>

        {/* Jumu'a section — harmonisée avec app-card */}
        <div className="app-card mt-4" id="jumuah" data-observe-section data-section-title="Jumu’a">
          <div className="app-title">Jumu’a</div>
          <div className="mt-2">
            <JumaaCard />
          </div>
        </div>

        {/* Informations pratiques */}
        <div className="app-card mt-4" id="infos" data-observe-section data-section-title="Informations pratiques">
          <div className="space-y-3">
            <div className="app-title">Informations pratiques</div>
            <div>
              {[
                { icon: Car, label: "Parking", value: true },
                { icon: User, label: "Espace femmes", value: true },
                { icon: Users, label: "Capacité mosquée", value: "200 personnes" },
                { icon: Accessibility, label: "Accès handicapé", value: true },
              ].map((row) => {
                const IconComp = row.icon as LucideIcon;
                return (
                  <div key={row.label} className={"relative flex items-center w-full px-1 py-2.5"}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <IconComp size={16} className="text-[var(--text-muted)]" />
                      <span className="text-[14px] font-[700] text-[var(--text)] truncate">{row.label}</span>
                    </div>
                    <div className="w-[128px] text-[14px] font-[700] text-[var(--text)] text-right truncate">
                      {typeof row.value === 'boolean' ? (row.value ? <Check size={16} className="text-emerald-600/80 inline-block" /> : '—') : row.value}
                    </div>
                  </div>
                );
              })}
              {/* Légales inline */}
              <div className={"relative flex items-center w-full px-1 py-2.5"}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Info size={16} className="text-[var(--text-muted)]" />
                  <span className="text-[14px] font-[700] text-[var(--text)] truncate">Informations légales</span>
                </div>
                <div className="w-[128px] text-right">
                  <a href="https://www.associations.gouv.fr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-black/10 bg-neutral-200/60 px-2 py-[2px] text-[12px] text-[var(--text)] hover:bg-neutral-300/60">Voir</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations légales supprimées (intégrées dans Infos pratiques) */}

        {/* Bénévolat */}
        <div className="app-card mt-4" id="benevolat" data-observe-section data-section-title="Bénévolat">
          <div className="space-y-3">
            <div className="app-title">Bénévolat</div>
            <div className="w-full rounded-12 overflow-hidden border border-[var(--border)] h-[230px] relative">
              <Image src="/benevolat.png" alt="Bénévolat RAM 94" fill className="object-cover" />
            </div>
            <p className="text-[12.5px] text-[var(--text-muted)]/90 leading-snug">Rejoignez l’équipe pour soutenir l’organisation des prières, Jumu’a et événements.</p>
            <div className="flex justify-end">
              <a href="/benevolat" className="pressable inline-flex items-center gap-2 h-10 px-4 text-white bg-black hover:bg-black/90 rounded-[12px]">
                Devenir bénévole
              </a>
            </div>
          </div>
        </div>

        {/* Petite mention association avant le footer */}
        <div className="app-card mt-4" id="about-neena" data-observe-section>
          <p className="text-[12.5px] text-[var(--text-muted)] leading-snug">
            Neena est une association à but non lucratif. Notre mission est d’assurer la transition digitale des mosquées et d’aider à mieux informer leurs fidèles.
            Nous ne prélevons aucune commission sur les dons et nous ne facturons aucun frais à la mosquée.
          </p>
        </div>

        {/* Footer léger */}
        <div className="mt-6 px-3 py-6 border-t border-black/5 text-[12px] text-[var(--text-muted)] flex items-center justify-between bg-[var(--surface-2)] rounded-12">
          <span>© {new Date().getFullYear()} Mosquée de Créteil</span>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <a href="/confidentialite" className="hover:underline">Politique de confidentialité</a>
            <a href="/a-propos" className="hover:underline">Qui sommes-nous ?</a>
            <a href="/contact" className="hover:underline">Nous contacter</a>
            <a href="/mentions-legales" className="hover:underline">Mentions légales</a>
          </div>
        </div>

        {/* (moved sticky bar outside container to avoid stacking issues) */}
      </div>
      {/* Removed extra sticky action bar; SectionHeader handles CTAs */}
    </>
  );
}

// InfoItem helper removed (not used)

function JumaaCard() {
  const params = useSearchParams();
  const j1s = (params.get("j1s") || "13:30").trim();
  const j1e = (params.get("j1e") || "14:10").trim();
  const _parking = (params.get("parking") || "oui").trim().toLowerCase() === 'oui';
  const khutbasCount = parseInt((params.get("khutbas") || "1").trim(), 10) || 1;
  const languages = (params.get("langues") || "Français, Arabe").split(",").map((s) => s.trim()).filter(Boolean);
  const imamName = (params.get("imam") || "").trim();
  const khutbaLanguages = (params.get("khutba_langues") || languages.join(", ")).split(",").map((s) => s.trim()).filter(Boolean);
  const duration = (params.get("khutba_duree") || "45 min").trim();
  const _parkingNote = (params.get("parking_note") || "Respectez le voisinage et le stationnement.").trim();
  const _womenSpace = (params.get("espace_femmes") || "oui").trim();
  return (
    <div className="w-full">
      <div className="mt-2">
        <div className="grid">
          <div className="relative flex items-center w-full px-1 py-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Clock size={16} className="text-[var(--text-muted)]" />
              <span className="text-[14px] font-[700] text-[var(--text)] truncate">Adhan</span>
            </div>
            <div className="w-[128px] text-[14px] font-[700] text-[var(--text)] text-right tabular-nums">{j1s}</div>
          </div>
          <div className="relative flex items-center w-full px-1 py-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Clock size={16} className="text-[var(--text-muted)]" />
              <span className="text-[14px] font-[700] text-[var(--text)] truncate">Iqama</span>
            </div>
            <div className="w-[128px] text-[14px] font-[700] text-[var(--text)] text-right tabular-nums">{j1e}</div>
          </div>
        </div>
        {/* Infos complémentaires Jumu’a — continuation sans espace */}
        <div>
          {[
            { icon: Users, label: "Nombre de khutbas", value: String(khutbasCount) },
            { icon: User, label: "Imam", value: imamName, hideIfEmpty: true },
            { icon: Globe, label: "Langues du khutba", value: khutbaLanguages.join(", ") },
            { icon: Clock, label: "Durée estimée", value: duration },
          ]
            .filter((row) => !(row.hideIfEmpty && !row.value))
            .map((row, _idx, _arr) => {
              const RowIcon = row.icon;
              return (
                <div key={row.label} className={"relative flex items-center w-full px-1 py-2.5"}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <RowIcon size={16} className="text-[var(--text-muted)]" />
                    <span className="text-[14px] font-[700] text-[var(--text)] truncate">{row.label}</span>
                  </div>
                  <div className="w-[128px] text-[14px] font-[700] text-[var(--text)] text-right truncate">{row.value}</div>
                </div>
              );
            })}
          <div className="mt-2 p-2 rounded-12 bg-yellow-50 text-[12px] text-yellow-800">Merci de ne pas gêner le voisinage et de vous garer sur des places appropriées.</div>
        </div>
      </div>
    </div>
  );
}

type PrayerValue = { adhan: string; iqama: string; wait_minutes: string | number } | null | undefined;
type MawaqitTimings = {
  Fajr?: PrayerValue;
  Sunrise?: PrayerValue;
  Dhuhr?: PrayerValue;
  Asr?: PrayerValue;
  Maghrib?: PrayerValue;
  Isha?: PrayerValue;
  Jumua?: PrayerValue;
};

function PrayerTimesCard({ slug, url }: { slug?: string; url?: string }) {
  const [times, setTimes] = useState<MawaqitTimings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_issues, setIssues] = useState<Array<{ field: string; message: string }>>([]);
  const [now, setNow] = useState(new Date());
  const [_lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  
  // Mettre à jour l'heure actuelle
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // Mise à jour toutes les minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const qs = new URLSearchParams();
        if (slug) qs.set("slug", slug);
        if (url) qs.set("url", url);
        // Cache-busting pour forcer le rechargement
        qs.set("t", Date.now().toString());
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json: { ok: boolean; timings?: MawaqitTimings; issues?: Array<{ field: string; message: string }>; error?: string } = await res.json();
        if (!json.ok || !json.timings) throw new Error(json.error || "API error");
        if (!cancelled) {
          setTimes(json.timings);
          setIssues(json.issues || []);
          setLastUpdated(new Date());
        }
      } catch {
        if (!cancelled) setError("Impossible de charger les horaires");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTimes();
    return () => { cancelled = true; };
  }, [slug, url]);

  const data = useMemo(() => {
    const labels: Array<{ key: keyof MawaqitTimings; label: string }> = [
      { key: "Fajr", label: "Fajr" },
      { key: "Dhuhr", label: (new Date().getDay() === 5 ? "Jumu'a" : "Dhuhr") },
      { key: "Asr", label: "Asr" },
      { key: "Maghrib", label: "Maghrib" },
      { key: "Isha", label: "Isha" },
    ];
    if (!times) return { items: [] };
    
    type Item = { key: string; label: string; adhan: string; iqama: string | null };
    const items: Item[] = labels.map(({ key, label }) => {
      const raw = times[key];
      if (!raw || typeof raw !== "object") {
        return { key: String(key), label, adhan: "", iqama: null };
      }
      
      const prayer = raw as { adhan: string; iqama: string; wait_minutes: string | number };
      return { 
        key: String(key), 
        label, 
        adhan: prayer.adhan || "", 
        iqama: prayer.iqama || null 
      };
    }).filter((i) => !!i.adhan);

    return { items };
  }, [times]);

  if (loading) return <div className="text-[14px] text-[var(--text-muted)]">Chargement…</div>;
  if (error || !times) return <div className="text-[14px] text-red-600">{error || "Indisponible"}</div>;

  return (
    <div className="w-full">
      {/* Horaires des prières (style fiche, progression visuelle) */}
      <div className="mt-2">
        <div className="grid">
          {/* En-tête aligné sur les colonnes des heures (au niveau de la 1ère ligne) */}
          <div className="flex items-center w-full px-1 py-1.5">
            <div className="flex-1" />
            <div className="w-[64px] text-right text-[11px] text-[var(--text-muted)]">Adhan</div>
            <div className="w-[64px] text-right text-[11px] text-[var(--text-muted)]">Iqama</div>
          </div>
          {data.items.map((item, _idx) => {
            const minutes = (t: string) => {
              const [hh, mm] = (t || "").split(":").map((x) => parseInt(x || "0", 10));
              return hh * 60 + mm;
            };
            const nowM = now.getHours() * 60 + now.getMinutes();
            const adhanM = minutes(item.adhan);
            const iqamaM = item.iqama ? minutes(item.iqama) : adhanM;
            const isPast = nowM > iqamaM;
            const isCurrent = nowM >= adhanM && nowM <= iqamaM;
            return (
              <div key={item.key} className={"relative flex items-center w-full px-1 py-2.5"}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isPast ? (
                    <Check size={16} className="text-emerald-600/80" />
                  ) : isCurrent ? (
                    <span className="w-3 h-3 rounded-full bg-white ring-2 ring-[var(--neena-green)]" />
                  ) : (
                    <Clock size={16} className="text-[var(--text-muted)]" />
                  )}
                  <span className="text-[14px] font-[700] text-[var(--text)] truncate">{item.label}</span>
                </div>
                <div className={`w-[64px] text-[14px] font-[700] tabular-nums ${isPast ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'} text-center`}>
                  {item.adhan}
                </div>
                <div className={`w/[64px] text-[14px] font-[700] tabular-nums ${isPast ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'} text-center`}>
                  {item.iqama || "—"}
                </div>
              </div>
            );
          })}
        </div>
        {/* Source Mawaqit (discret) */}
        <div className="mt-3 flex justify-end px-1 text-[11px] text-[var(--text-muted)]">
          <span>Source Mawaqit</span>
          <a href="/mawaqit" aria-label="À propos de Mawaqit" className="ml-1 inline-flex items-center">
            <Info size={12} />
          </a>
        </div>
      </div>
      
      {/* Légende retirée (info via icônes en en-tête) */}
    </div>
  );
}

// (NextPrayerBanner removed – not used)