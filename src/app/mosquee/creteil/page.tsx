"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AppBar, SideMenu } from "@/components";
import { GlobalHeader } from "@/components/headers/GlobalHeader";
import { SectionHeader as StickySectionHeader } from "@/components/headers/SectionHeader";
import { useActiveSection } from "@/hooks/useActiveSection";
import { CardDS, CardDSBody, CardDSHeader, SectionHeader, SummaryRow } from "@/components/ds";
import CurrentPrayerSection from "@/components/CurrentPrayerSection";
import CurrentTimeSection from "@/components/CurrentTimeSection";
import { Input } from "@/components";
import { Mail, MapPin, Check, X, Car, Users, Accessibility, Clock, Info } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;
const ASSO_NAME = "Association Mosquée de Créteil";
const ASSO_REG_LINK = "https://www.journal-officiel.gouv.fr/associations/";
const ASSO_PRESIDENT = "Nom du Président";
const ASSO_CREATED_AT = "01/01/2010";

export default function MosqueCreteilPage() {
  return (
    <Suspense fallback={<div />}> 
      <MosqueCreteilContent />
    </Suspense>
  );
}

function MosqueCreteilContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [heroInView, setHeroInView] = useState(true);
  const params = useSearchParams();

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

  return (
    <>
      <GlobalHeader onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {/* Mini header should appear only after hero is passed; positioned below global header */}
      <StickySectionHeader title={useActiveSection().activeTitle} />

      <div className="app-container pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
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
              <a href="/step-amount-v2" className="btn-primary pressable flex-1 flex items-center justify-center gap-2 py-3 h-11">
                <Mail size={16} />
                Faire un don
              </a>
            </div>
          </div>
        </div>

        {/* Heure & dates + Prière actuelle (fusionnées) */}
        <div id="hero-end" className="app-card mt-4" data-observe-section data-section-title={MOSQUE_NAME}>
          <div className="space-y-4">
            <CurrentTimeSection embedded />
            <CurrentPrayerSection slug={mawaqitSlug} url={mawaqitUrl} embedded />
          </div>
        </div>

        {/* Next Prayer section removed */}

        {/* Horaires (API interne) — DS primitives */}
        <div className="mt-4" id="horaires" data-observe-section data-section-title="Horaires de prière">
          <CardDS>
            <CardDSHeader>
              <SectionHeader title="Horaires de prière" subtitle="Source Mawaqit" />
            </CardDSHeader>
            <CardDSBody>
              <PrayerTimesCard slug={mawaqitSlug} url={mawaqitUrl} />
            </CardDSBody>
          </CardDS>
        </div>

        {/* Jumu'a section — DS primitives */}
        <div className="mt-4" id="jumuah" data-observe-section data-section-title="Jumu’a">
          <CardDS>
            <CardDSHeader>
              <SectionHeader title="Jumu’a" />
            </CardDSHeader>
            <CardDSBody>
              <JumaaCard />
            </CardDSBody>
          </CardDS>
        </div>

        {/* Informations pratiques */}
        <div className="app-card mt-4" id="infos" data-observe-section data-section-title="Informations pratiques">
          <div className="space-y-3">
            <div className="app-title">Informations pratiques</div>
            <div className="grid gap-3">
              <InfoItem icon={<Car size={16} />} label="Parking" value={true} />
              <InfoItem icon={<Users size={16} />} label="Capacité mosquée" value="200 personnes" />
              <InfoItem icon={<Car size={16} />} label="Capacité parking" value="50 places" />
              <InfoItem icon={<Accessibility size={16} />} label="Accès handicapé" value={true} />
            </div>
          </div>
        </div>

        {/* Informations légales */}
        <div className="app-card mt-4" id="legales" data-observe-section data-section-title="Informations légales">
          <div className="space-y-3">
            <div className="app-title">Informations légales</div>
            <div className="grid gap-3">
              <InfoItem icon={<Mail size={16} />} label="Association" value={ASSO_NAME} />
              <InfoItem icon={<Users size={16} />} label="Président" value={ASSO_PRESIDENT} />
              <InfoItem icon={<Clock size={16} />} label="Création" value={ASSO_CREATED_AT} />
              <div className="flex items-center justify-between p-2 rounded-12">
                <div className="flex items-center gap-2 text-[14px] text-[var(--text)]">
                  <Mail size={16} />
                  <span>Registre légal</span>
                </div>
            <div>
                  <a
                    href={ASSO_REG_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-green-600 hover:underline"
                  >
                    Voir
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bénévolat */}
        <div className="app-card mt-4" id="benevolat" data-observe-section data-section-title="Bénévolat">
          <div className="space-y-3">
            <div className="app-title">Bénévolat</div>
            <p className="text-[13px] text-[var(--text-muted)]">Rejoignez l’équipe pour soutenir l’organisation des prières, Jumu’a et événements.</p>
            <div>
              <a href="/benevolat" className="btn-secondary pressable inline-flex items-center gap-2 px-4 py-2">
                Devenir bénévole
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="app-card mt-4" id="newsletter" data-observe-section data-section-title="Newsletter">
          <div className="space-y-3">
            <div className="app-title">Newsletter</div>
            <p className="text-[13px] text-[var(--text-muted)]">Recevez les horaires & annonces importantes (1 à 2 emails/mois).</p>
            <div className="flex gap-2">
                <Input
                type="email"
                placeholder="Votre email"
                value={newsletterEmail}
                onChange={(value) => setNewsletterEmail(value)}
                />
              <button className="btn-primary pressable px-4 py-2" onClick={() => alert('Inscription réussie !')}>
                S&apos;inscrire
              </button>
            </div>
          </div>
        </div>

        {/* (moved sticky bar outside container to avoid stacking issues) */}
      </div>
      {/* Removed extra sticky action bar; SectionHeader handles CTAs */}
    </>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | boolean }) {
  const text = typeof value === "boolean" ? (value ? "Oui" : "Non") : value;
  return (
    <div className="flex items-center justify-between p-2 rounded-12">
      <div className="flex items-center gap-2 text-[14px] text-[var(--text)]">
        {icon}
        <span>{label}</span>
      </div>
      <div>
        {typeof value === "boolean" ? (
          value ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-500" />
        ) : (
          <span className="text-[14px] text-[var(--text-muted)]">{text}</span>
        )}
      </div>
    </div>
  );
}

function JumaaCard() {
  const params = useSearchParams();
  const j1s = (params.get("j1s") || "13:30").trim();
  const j1e = (params.get("j1e") || "14:10").trim();
  const khutbasCount = parseInt((params.get("khutbas") || "1").trim(), 10) || 1;
  const languages = (params.get("langues") || "Français, Arabe").split(",").map((s) => s.trim()).filter(Boolean);
  const imamName = (params.get("imam") || "").trim();
  const khutbaLanguages = (params.get("khutba_langues") || languages.join(", ")).split(",").map((s) => s.trim()).filter(Boolean);
  const duration = (params.get("khutba_duree") || "45 min").trim();
  const expectedCapacity = (params.get("khutba_capacite") || "—").trim();
  const parkingNote = (params.get("parking_note") || "Respectez le voisinage et le stationnement.").trim();
  const womenSpace = (params.get("espace_femmes") || "oui").trim();
  const womenSpaceCapacity = (params.get("espace_femmes_capacite") || "—").trim();
  return (
    <div className="grid gap-3">
      <InfoItem icon={<Clock size={16} />} label="Heure Jumu'a" value={j1s} />
      <InfoItem icon={<Clock size={16} />} label="Iqama Jumu'a" value={j1e} />
      <InfoItem icon={<Users size={16} />} label="Nombre de khutbas" value={String(khutbasCount)} />
      {imamName && <InfoItem icon={<Users size={16} />} label="Imam" value={imamName} />}
      <InfoItem icon={<Users size={16} />} label="Langues du khutba" value={khutbaLanguages.join(", ")} />
      <InfoItem icon={<Clock size={16} />} label="Durée estimée" value={duration} />
      <InfoItem icon={<Users size={16} />} label="Capacité attendue" value={expectedCapacity} />
      <InfoItem icon={<Users size={16} />} label="Espace femmes" value={womenSpace.toLowerCase() === 'oui' ? true : false} />
      <InfoItem icon={<Users size={16} />} label="Capacité espace femmes" value={womenSpaceCapacity} />
      <div className="p-2 rounded-12 bg-yellow-50 text-[12px] text-yellow-800">
        {parkingNote}
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
      <div className="mt-4">
        <div className="grid gap-2">
          {/* En-tête aligné sur les colonnes des heures (au niveau de la 1ère ligne) */}
          <div className="flex items-center w-full px-3 py-1">
            <div className="flex-1" />
            <div className="w-[64px] text-center text-[11px] text-[var(--text-muted)]">Adhan</div>
            <div className="w-[64px] text-center text-[11px] text-[var(--text-muted)]">Iqama</div>
          </div>
          {data.items.map((item) => {
            const minutes = (t: string) => {
              const [hh, mm] = (t || "").split(":").map((x) => parseInt(x || "0", 10));
              return hh * 60 + mm;
            };
            const nowM = now.getHours() * 60 + now.getMinutes();
            const adhanM = minutes(item.adhan);
            const iqamaM = item.iqama ? minutes(item.iqama) : adhanM;
            const isPast = nowM > iqamaM;
            const isCurrent = nowM >= adhanM && nowM <= iqamaM;
            const rowClass = isCurrent ? "ring-1 ring-green-500/60 bg-white" : isPast ? "bg-gray-50 opacity-90" : "bg-white";
            const progress = isCurrent ? Math.max(0, Math.min(1, (nowM - adhanM) / Math.max(1, iqamaM - adhanM))) : 0;
            return (
              <div key={item.key} className={`summary-row relative ${rowClass}`}>
                <div className="flex items-center gap-2 flex-1">
                  {isPast ? (
                    <Check size={16} className="text-green-600" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                  ) : (
                    <Clock size={16} className="text-[var(--text-muted)]" />
                  )}
                  <span className="text-[14px] font-[700] text-[var(--text)]">{item.label}</span>
                </div>
                <div className={`w-[64px] text-[14px] font-[700] ${isPast ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'} text-center`}>
                  {item.adhan}
                </div>
                <div className={`w-[64px] text-[14px] font-[700] ${isPast ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'} text-center`}>
                  {item.iqama || "—"}
                </div>
                {isCurrent && (
                  <div className="absolute left-6 right-6 bottom-2 h-2 bg-gray-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_6px_rgba(34,197,94,0.35)] transition-[width] duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
                  </div>
                )}
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