"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  CreditCard,
  Check,
  Car,
  Users,
  Accessibility,
  Info,
  Globe,
  Book,
  Clock,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SideMenu } from "@/components";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import CurrentPrayerSection from "@/components/CurrentPrayerSection";
import CurrentTimeSection from "@/components/CurrentTimeSection";
import { GlassCard, GlassSection, PrimaryButton } from "@/components/ds";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilV7Page() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] w-full bg-[#0d3326]" />}>
      <MosqueCreteilV7Content />
    </Suspense>
  );
}

function MosqueCreteilV7Content() {
  const router = useRouter();
  const params = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const heroImages = useMemo(() => {
    const override = params.get("img");
    return [override || "/hero-creteil.png", "/hero-creteil-2.png"];
  }, [params]);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!heroPaused) setHeroSlide((s) => (s + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroImages.length, heroPaused]);

  const mawaqitSlug = (params.get("slug") || "mosquee-sahaba-creteil").trim();
  const mawaqitUrl = params.get("url") || undefined;

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-[100svh] w-full bg-[#0d3326]">
        <main className="px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-8">
            <HeroCard
              heroImages={heroImages}
              slide={heroSlide}
              onPause={() => setHeroPaused(true)}
              onResume={() => setHeroPaused(false)}
              onDonate={() => router.push("/step-amount-v2")}
            />

            <PrayerOverviewCard slug={mawaqitSlug} url={mawaqitUrl} />
            <PrayerTimesCard slug={mawaqitSlug} url={mawaqitUrl} />
            <JumaaCard />
            <PracticalInfoCard />
            <VolunteerCard />

            <GlassCard className="text-white text-[13px] leading-relaxed bg-white/12">
              Neena est une association à but non lucratif. Notre mission est d’assurer la transition digitale des mosquées et d’aider à mieux informer leurs fidèles.
              Nous ne prélevons aucune commission sur les dons et nous ne facturons aucun frais à la mosquée.
            </GlassCard>

            <GlassCard className="flex flex-col gap-4 text-[12.5px] text-white/75 md:flex-row md:items-center md:justify-between bg-white/12">
              <span>© {new Date().getFullYear()} Mosquée de Créteil</span>
              <div className="flex flex-wrap items-center gap-4">
                <a href="/confidentialite" className="hover:underline">
                  Politique de confidentialité
                </a>
                <a href="/a-propos" className="hover:underline">
                  Qui sommes-nous ?
                </a>
                <a href="/contact" className="hover:underline">
                  Nous contacter
                </a>
                <a href="/mentions-legales" className="hover:underline">
                  Mentions légales
                </a>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </>
  );
}

function HeroCard({
  heroImages,
  slide,
  onPause,
  onResume,
  onDonate,
}: {
  heroImages: string[];
  slide: number;
  onPause: () => void;
  onResume: () => void;
  onDonate: () => void;
}) {
  return (
    <GlassCard className="bg-white/12 text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/20">
      <div
        className="relative h-[260px] w-full overflow-hidden rounded-3xl"
        onMouseEnter={onPause}
        onMouseLeave={onResume}
        onTouchStart={onPause}
        onTouchEnd={onResume}
      >
        {heroImages.map((src, idx) => (
          <Image
            key={src + idx}
            src={src}
            alt={MOSQUE_NAME}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className={`absolute inset-0 object-cover transition-opacity duration-700 ${slide === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {heroImages.map((_, idx) => (
            <span
              key={idx}
              className={`h-2.5 w-2.5 rounded-full ${slide === idx ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
      <GlassSection className="mt-4 bg-transparent text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold md:text-[28px]">{MOSQUE_NAME}</h1>
            <div className="mt-1 flex items-center gap-2 text-[14px] text-white/70">
              <MapPin size={16} />
              <span>{MOSQUE_ADDRESS}</span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <PrimaryButton
              width="full"
              variant="glass"
              className="md:w-auto"
              onClick={() => window.open(MAPS_URL, "_blank")}
            >
              <MapPin size={16} />
              Itinéraire
            </PrimaryButton>
            <PrimaryButton width="full" variant="white" className="md:w-auto" onClick={onDonate}>
              <CreditCard size={16} />
              Faire un don
            </PrimaryButton>
          </div>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-white/80">
          La mosquée Sahaba accompagne la communauté avec des prières quotidiennes, des programmes éducatifs et des actions sociales.
          Rejoignez-nous pour faire rayonner le message d’unité et de générosité.
        </p>
      </GlassSection>
    </GlassCard>
  );
}

function PrayerOverviewCard({ slug, url }: { slug?: string; url?: string }) {
  return (
    <GlassCard className="border border-white/20 bg-white/10 backdrop-blur-xl text-white">
      <GlassSection>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[17px] font-semibold">Prochaine prière</div>
            <div className="text-[13px] text-white/70">Compteur en temps réel et calendrier intégré</div>
          </div>
        </div>
      </GlassSection>
      <GlassSection className="mt-4 space-y-4">
        <CurrentPrayerSection slug={slug} url={url} embedded />
        <CurrentTimeSection embedded />
      </GlassSection>
    </GlassCard>
  );
}

function PrayerTimesCard({ slug, url }: { slug?: string; url?: string }) {
  const [times, setTimes] = useState<MawaqitTimings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
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
        qs.set("t", Date.now().toString());
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json: { ok: boolean; timings?: MawaqitTimings; error?: string } = await res.json();
        if (!json.ok || !json.timings) throw new Error(json.error || "API error");
        if (!cancelled) setTimes(json.timings);
      } catch {
        if (!cancelled) setError("Impossible de charger les horaires");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTimes();
    return () => {
      cancelled = true;
    };
  }, [slug, url]);

  const items = useMemo(() => {
    const ordered: Array<{ key: keyof MawaqitTimings; label: string }> = [
      { key: "Fajr", label: "Fajr" },
      { key: "Dhuhr", label: new Date().getDay() === 5 ? "Jumu’a" : "Dhuhr" },
      { key: "Asr", label: "Asr" },
      { key: "Maghrib", label: "Maghrib" },
      { key: "Isha", label: "Isha" },
    ];
    return ordered
      .map(({ key, label }) => {
        const raw = times?.[key];
        if (!raw || typeof raw !== "object") return null;
        return { key: String(key), label, adhan: raw.adhan, iqama: raw.iqama };
      })
      .filter(Boolean) as Array<{ key: string; label: string; adhan: string; iqama: string | null }>;
  }, [times]);

  return (
    <GlassCard className="border border-white/20 bg-white/10 text-white" id="horaires">
      <GlassSection>
        <div className="text-[17px] font-semibold">Horaires de prière</div>
        <div className="text-[13px] text-white/70">Synchronisés avec Mawaqit et mis à jour chaque minute</div>
      </GlassSection>
      <GlassSection className="mt-4">
        {loading ? (
          <div className="text-white/70">Chargement…</div>
        ) : error || !times ? (
          <div className="text-red-200">{error || "Indisponible"}</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center px-1 text-[12px] text-white/60">
              <span className="flex-1" />
              <span className="w-[72px] text-right">Adhan</span>
              <span className="w-[72px] text-right">Iqama</span>
            </div>
            {items.map((item) => {
              const minutes = (value: string | null) => {
                if (!value) return 0;
                const [hh, mm] = value.split(":").map((v) => parseInt(v || "0", 10));
                return hh * 60 + mm;
              };
              const nowMin = now.getHours() * 60 + now.getMinutes();
              const adhanMin = minutes(item.adhan);
              const iqamaMin = minutes(item.iqama);
              const past = nowMin > iqamaMin && iqamaMin > 0;
              const current = nowMin >= adhanMin && nowMin <= iqamaMin;
              return (
                <div key={item.key} className="flex items-center rounded-2xl bg-white/12 px-3 py-2">
                  <div className="flex flex-1 items-center gap-3">
                    {past ? (
                      <Check size={16} className="text-emerald-300" />
                    ) : current ? (
                      <span className="h-3 w-3 rounded-full bg-white ring-2 ring-emerald-300" />
                    ) : (
                      <Clock size={16} className="text-white/60" />
                    )}
                    <span className="text-[14px] font-semibold">{item.label}</span>
                  </div>
                  <div className={`w-[72px] text-right text-[14px] tabular-nums ${past ? "text-white/50" : "text-white"}`}>
                    {item.adhan || "—"}
                  </div>
                  <div className={`w-[72px] text-right text-[14px] tabular-nums ${past ? "text-white/50" : "text-white"}`}>
                    {item.iqama || "—"}
                  </div>
                </div>
              );
            })}
            <div className="mt-3 flex justify-end text-[11px] text-white/60">
              Source Mawaqit
              <a href="/mawaqit" className="ml-1 inline-flex items-center">
                <Info size={11} />
              </a>
            </div>
          </div>
        )}
      </GlassSection>
    </GlassCard>
  );
}

function JumaaCard() {
  const params = useSearchParams();
  const adhan = (params.get("j1s") || "13:30").trim();
  const iqama = (params.get("j1e") || "14:10").trim();
  const khutbasCount = parseInt((params.get("khutbas") || "1").trim(), 10) || 1;
  const imamName = (params.get("imam") || "").trim();
  const languages = (params.get("langues") || "Français, Arabe")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const duration = (params.get("khutba_duree") || "45 min").trim();

  const rows: Array<{ icon: LucideIcon; label: string; value: string; hide?: boolean }> = [
    { icon: Clock, label: "Adhan", value: adhan },
    { icon: Clock, label: "Iqama", value: iqama },
    { icon: Users, label: "Nombre de khutbas", value: String(khutbasCount) },
    { icon: User, label: "Imam", value: imamName, hide: !imamName },
    { icon: Globe, label: "Langues du khutba", value: languages.join(", ") },
    { icon: Book, label: "Durée estimée", value: duration },
  ];

  return (
    <GlassCard className="border border-white/20 bg-white/12 text-white" id="jumuah">
      <GlassSection>
        <div className="text-[17px] font-semibold">Jumu’a</div>
      </GlassSection>
      <GlassSection className="mt-3 space-y-2">
        {rows
          .filter((row) => !row.hide)
          .map(({ icon: IconComp, label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-white/12 px-3 py-2">
              <div className="flex items-center gap-2 text-[14px] font-semibold">
                <IconComp size={16} className="text-emerald-200" />
                {label}
              </div>
              <div className="text-[14px] font-semibold text-white tabular-nums">{value || "—"}</div>
            </div>
          ))}
        <div className="mt-3 rounded-2xl bg-emerald-400/25 px-3 py-2 text-[12px] text-white">
          Merci de respecter le voisinage lors du stationnement et de privilégier le covoiturage.
        </div>
      </GlassSection>
    </GlassCard>
  );
}

function PracticalInfoCard() {
  const rows: Array<{ icon: LucideIcon; label: string; value: string | boolean }> = [
    { icon: Car, label: "Parking", value: true },
    { icon: User, label: "Espace femmes", value: true },
    { icon: Users, label: "Capacité mosquée", value: "200 personnes" },
    { icon: Accessibility, label: "Accès handicapé", value: true },
    { icon: Globe, label: "Cours d’arabe", value: true },
    { icon: Book, label: "Cours de religion", value: true },
  ];

  return (
    <GlassCard className="border border-white/20 bg-white/12 text-white" id="infos">
      <GlassSection>
        <div className="text-[17px] font-semibold">Informations pratiques</div>
      </GlassSection>
      <GlassSection className="mt-3 space-y-2">
        {rows.map(({ icon: IconComp, label, value }) => (
          <div key={label} className="flex items-center justify-between rounded-2xl bg-white/12 px-3 py-2">
            <div className="flex items-center gap-2 text-[14px] font-semibold">
              <IconComp size={16} className="text-emerald-200" />
              {label}
            </div>
            <div className="text-[14px] font-semibold text-white">
              {typeof value === "boolean" ? (value ? <Check size={16} className="text-emerald-300" /> : "—") : value}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-2xl bg-white/12 px-3 py-2">
          <div className="flex items-center gap-2 text-[14px] font-semibold">
            <Info size={16} className="text-emerald-200" />
            Informations légales
          </div>
          <a
            href="https://www.associations.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/40 px-3 py-1 text-[12px] text-white hover:bg-white/15"
          >
            Voir
          </a>
        </div>
      </GlassSection>
    </GlassCard>
  );
}

function VolunteerCard() {
  return (
    <GlassCard className="border border-white/20 bg-white/12 text-white" id="benevolat">
      <GlassSection>
        <div className="text-[17px] font-semibold">Bénévolat</div>
        <p className="mt-2 text-[13px] text-white/75">
          Rejoignez l’équipe pour soutenir l’organisation des prières, de la Jumu’a et des événements sociaux.
        </p>
      </GlassSection>
      <GlassSection className="mt-3 space-y-3">
        <div className="relative h-[220px] w-full overflow-hidden rounded-3xl">
          <Image src="/benevolat.png" alt="Bénévolat" fill className="object-cover" />
        </div>
        <div className="flex justify-end">
          <PrimaryButton variant="white" onClick={() => window.open("/benevolat", "_self")}>Devenir bénévole</PrimaryButton>
        </div>
      </GlassSection>
    </GlassCard>
  );
}

// --- Types & helpers copied from the original page to preserve behaviour ---
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


