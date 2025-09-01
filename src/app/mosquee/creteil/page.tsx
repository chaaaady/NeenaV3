"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AppBar, SideMenu } from "@/components";
import { Input } from "@/components";
import { Mail, MapPin, Check, X, Car, Users, Accessibility, Languages, Clock } from "lucide-react";

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
  const params = useSearchParams();

  // Hero image (configurable via ?img=...)
  const heroImg = useMemo(() => {
    const url = params.get("img");
    return (
      url ||
      "https://images.unsplash.com/photo-1527964275784-0045f1eead42?q=80&w=1200&auto=format&fit=crop"
    );
  }, [params]);

  // Mawaqit slug/url (override via query if needed)
  const mawaqitSlug = (params.get("slug") || "mosquee-sahaba-creteil").trim();
  const mawaqitUrl = params.get("url") || undefined;

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="app-container pb-24">
        {/* Hero */}
        <div className="app-card">
          <div className="space-y-3">
            <div className="w-full rounded-12 overflow-hidden border border-[var(--border)] relative h-[180px]">
              <Image src={heroImg} alt={MOSQUE_NAME} fill sizes="(max-width: 600px) 100vw, 600px" className="object-cover" />
            </div>
            <div className="app-title">{MOSQUE_NAME}</div>
            <div className="text-[14px] text-[var(--text-muted)] flex items-center gap-2">
              <MapPin size={16} />
              <span>{MOSQUE_ADDRESS}</span>
            </div>
            <div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary pressable inline-flex items-center gap-2 px-4 py-2"
              >
                Itinéraire
              </a>
            </div>
          </div>
        </div>

        {/* Bandeau prochaine prière (hors carte des horaires) */}
        <div className="app-card mt-4">
          <NextPrayerBanner slug={mawaqitSlug} url={mawaqitUrl} />
        </div>

        {/* Horaires (API interne) */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Horaires de prière</div>
            <PrayerTimesCard slug={mawaqitSlug} url={mawaqitUrl} />
          </div>
        </div>

        {/* Jumu'a section (below prayer times) */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Jumu&apos;a</div>
            <JumaaCard />
          </div>
        </div>

        {/* Informations pratiques */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Informations pratiques</div>
            <div className="grid gap-3">
              <InfoItem icon={<Car size={16} />} label="Parking" value={true} />
              <InfoItem icon={<Users size={16} />} label="Salle femmes" value={true} />
              <InfoItem icon={<Accessibility size={16} />} label="Accès PMR" value={true} />
              <InfoItem icon={<Languages size={16} />} label="Langue du khutba" text="Français" />
              <InfoItem icon={<Users size={16} />} label="Nombre de khutbas" text="2" />
              <InfoItem icon={<Users size={16} />} label="Capacité de la mosquée" text="~800 fidèles" />
              <InfoItem icon={<Car size={16} />} label="Capacité du parking" text="~120 places" />
            </div>
          </div>
        </div>

        {/* Devenir bénévole */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Devenir bénévole</div>
            <div className="text-[14px] text-[var(--text-soft)]">Contribuez à la vie de la mosquée.</div>
            <div>
              <a href="/benevolat" className="btn-primary pressable inline-flex items-center gap-2 px-4 py-2">
                Remplir le formulaire
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Recevoir la newsletter</div>
            <div className="text-[14px] text-[var(--text-soft)]">Recevez le rappel et le résumé du khutba chaque vendredi.</div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={newsletterEmail}
                  onChange={(v: string) => setNewsletterEmail(v)}
                  placeholder="Votre email"
                  type="email"
                  leftIcon={<Mail size={16} />}
                />
              </div>
              <button className="btn-primary pressable px-4">S&apos;inscrire</button>
            </div>
          </div>
        </div>

        {/* Légales */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Informations légales</div>
            <div className="grid gap-2">
              <div className="summary-row">
                <span className="text-[14px] font-[600] text-[var(--text)]">Association</span>
                <span className="text-[14px] text-[var(--text)]">{ASSO_NAME}</span>
              </div>
              <div className="summary-row">
                <span className="text-[14px] font-[600] text-[var(--text)]">Président</span>
                <span className="text-[14px] text-[var(--text)]">{ASSO_PRESIDENT}</span>
              </div>
              <div className="summary-row">
                <span className="text-[14px] font-[600] text-[var(--text)]">Date de création</span>
                <span className="text-[14px] text-[var(--text)]">{ASSO_CREATED_AT}</span>
              </div>
              <div className="summary-row">
                <span className="text-[14px] font-[600] text-[var(--text)]">Registre légal</span>
                <a className="text-[14px] text-green-700 underline" href={ASSO_REG_LINK} target="_blank" rel="noopener noreferrer">Consulter</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="app-card mt-4">
          <div className="text-[13px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} {MOSQUE_NAME}. Mentions légales · Confidentialité · Contact
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky-actions">
        <div className="w-full bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] pb-safe">
          <div className="mx-auto max-w-[900px] px-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary pressable w-full h-12 flex items-center justify-center text-center"
              >
                Itinéraire
              </a>
              <a href="/step-amount-v2" className="btn-primary pressable w-full h-12 flex items-center justify-center text-center">Faire un don</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoItem({ icon, label, value, text }: { icon: React.ReactNode; label: string; value?: boolean; text?: string }) {
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
  return (
    <div className="grid gap-2">
      <div className="summary-row">
        <span className="text-[14px] font-[600] text-[var(--text)]">Début du khutba</span>
        <span className="text-[14px] text-[var(--text)]">{j1s}</span>
      </div>
      <div className="summary-row">
        <span className="text-[14px] font-[600] text-[var(--text)]">Fin du khutba</span>
        <span className="text-[14px] text-[var(--text)]">{j1e}</span>
      </div>
    </div>
  );
}

type PrayerValue = string | { adhan?: string; iqama?: string; wait?: number } | null | undefined;
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
  const [issues, setIssues] = useState<Array<{ field: string; message: string }>>([]);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    // Met à jour l'heure courante sans seconds (toutes les 30s)
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
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
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json: { ok: boolean; timings?: MawaqitTimings; flat?: Record<string, string>; issues?: Array<{ field: string; message: string }>; error?: string } = await res.json();
        if (!json.ok || (!json.timings && !json.flat)) throw new Error(json.error || "API error");
        if (!cancelled) {
          const flat = json.flat && Object.keys(json.flat).length > 0 ? (json.flat as unknown as MawaqitTimings) : null;
          setTimes(flat || json.timings || null);
          setIssues(json.issues || []);
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

  const { list } = useMemo(() => {
    const labels: Array<{ key: keyof MawaqitTimings; label: string }> = [
      { key: "Fajr", label: "Fajr" },
      { key: "Dhuhr", label: "Dhuhr" },
      { key: "Asr", label: "Asr" },
      { key: "Maghrib", label: "Maghrib" },
      { key: "Isha", label: "Isha" },
    ];
    if (!times) return { list: [] as Array<{ key: string; label: string; time: string; isNext: boolean }> };
    type Item = { key: string; label: string; time: string; date: Date };
    const items: Item[] = labels
      .map(({ key, label }) => {
        const raw = times[key];
        let t = "";
        if (typeof raw === "string") {
          t = raw.trim();
        } else if (raw && typeof raw === "object") {
          const r = raw as { adhan?: string; iqama?: string };
          t = (r.adhan || r.iqama || "").trim();
        }
        const [hh, mm] = (t || "00:00").split(":").map((x) => parseInt(x, 10));
        const dt = new Date(); dt.setHours(hh, mm, 0, 0);
        return { key: String(key), label, time: t, date: dt };
      })
      .filter((i) => !!i.time);

    // no next in this card — banner handles it
    const listed = items.map((it) => ({ key: it.key, label: it.label, time: it.time, isNext: false }));
    return { list: listed };
  }, [times]);

  if (loading) {
    return (
      <div className="grid gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="summary-row">
            <span className="h-4 w-20 bg-[var(--skeleton)] rounded" />
            <span className="h-4 w-14 bg-[var(--skeleton)] rounded" />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return <div className="text-[14px] text-red-600">{error}</div>;
  }
  if (!times) {
    return <div className="text-[14px] text-[var(--text-muted)]">Aucun horaire disponible.</div>;
  }

  return (
    <div className="space-y-3">
      {/* Banner déplacé en dehors de la carte des horaires */}
      <div className="grid gap-2">
        {list.map((it) => (
          <div key={it.key} className={`summary-row ${it.isNext ? "ring-2 ring-[var(--focus)]" : ""}`}>
            <span className="text-[14px] font-[600] text-[var(--text)]">{it.label}</span>
            <span className="text-[14px] text-[var(--text)]">{it.time}</span>
          </div>
        ))}
      </div>
      {issues.length > 0 && (
        <div className="rounded-12 border border-yellow-500/40 bg-yellow-500/10 p-2">
          <div className="text-[13px] font-[600] text-yellow-700">Vérifications</div>
          <ul className="mt-1 text-[12px] text-yellow-800 list-disc list-inside">
            {issues.map((it, idx) => (
              <li key={`${it.field}-${idx}`}>{it.field}: {it.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function NextPrayerBanner({ slug, url }: { slug?: string; url?: string }) {
  const [times, setTimes] = useState<MawaqitTimings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
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
        const res = await fetch(`/api/mawaqit?${qs.toString()}`, { cache: "no-store" });
        const json: { ok: boolean; timings?: MawaqitTimings; flat?: Record<string, string>; error?: string } = await res.json();
        if (!json.ok || (!json.timings && !json.flat)) throw new Error(json.error || "API error");
        if (!cancelled) {
          const flat = json.flat && Object.keys(json.flat).length > 0 ? (json.flat as unknown as MawaqitTimings) : null;
          setTimes(flat || json.timings || null);
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
      { key: "Dhuhr", label: "Dhuhr" },
      { key: "Asr", label: "Asr" },
      { key: "Maghrib", label: "Maghrib" },
      { key: "Isha", label: "Isha" },
    ];
    if (!times) return { nextName: null as string | null, nextTime: null as string | null, nextDate: null as Date | null };
    type Item = { key: string; label: string; time: string; date: Date };
    const items: Item[] = labels.map(({ key, label }) => {
      const raw = times[key];
      let t = "";
      if (typeof raw === "string") t = raw.trim();
      else if (raw && typeof raw === "object") {
        const r = raw as { adhan?: string; iqama?: string };
        t = (r.adhan || r.iqama || "").trim();
      }
      const [hh, mm] = (t || "00:00").split(":").map((x) => parseInt(x, 10));
      const dt = new Date(); dt.setHours(hh, mm, 0, 0);
      return { key: String(key), label, time: t, date: dt };
    }).filter((i) => !!i.time);

    let nextK: string | null = null;
    let nextT: string | null = null;
    let nextDT: Date | null = null;
    for (const it of items) {
      if (it.date.getTime() > now.getTime()) { nextK = it.label; nextT = it.time; nextDT = it.date; break; }
    }
    if (!nextK && items.length > 0) { nextK = items[0].label; nextT = items[0].time; nextDT = items[0].date; }
    if (nextDT && nextDT.getTime() <= now.getTime()) { const d = new Date(nextDT); d.setDate(d.getDate() + 1); nextDT = d; }
    return { nextName: nextK, nextTime: nextT, nextDate: nextDT };
  }, [times, now]);

  if (loading) return <div className="text-[14px] text-[var(--text-muted)]">Chargement…</div>;
  if (error || !data.nextName) return <div className="text-[14px] text-red-600">{error || "Indisponible"}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[13px] text-[var(--text-muted)]">
        <span>
          {now.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
        </span>
        <span>
          {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[14px] text-[var(--text)]">
        <Clock size={16} />
        <span>
          Prochaine prière: <strong>{data.nextName}</strong> à <strong>{data.nextTime}</strong>
          {data.nextDate && (
            <>
              {" "}— dans{" "}
              <strong>
                {(() => {
                  const ms = Math.max(0, data.nextDate!.getTime() - now.getTime());
                  const totalMin = Math.ceil(ms / 60000);
                  const h = Math.floor(totalMin / 60);
                  const m = totalMin % 60;
                  if (h <= 0) return `${m} min`;
                  if (m === 0) return `${h} h`;
                  return `${h} h ${m} min`;
                })()}
              </strong>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

