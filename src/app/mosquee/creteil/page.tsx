"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppBar, SideMenu } from "@/components";
import { Input } from "@/components";
import { Mail, MapPin, Check, X, Car, Users, Accessibility, Languages, Clock } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const params = useSearchParams();

  // Hero image (configurable via ?img=...)
  const heroImg = useMemo(() => {
    const url = params.get("img");
    return (
      url ||
      "https://images.unsplash.com/photo-1527964275784-0045f1eead42?q=80&w=1200&auto=format&fit=crop" // generic mosque image fallback
    );
  }, [params]);

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="app-container">
        {/* Hero */}
        <div className="app-card">
          <div className="space-y-3">
            <div className="w-full rounded-12 overflow-hidden border border-[var(--border)]">
              <img src={heroImg} alt={MOSQUE_NAME} className="w-full h-[180px] object-cover" />
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

        {/* Horaires (Aladhan) */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Horaires de prière</div>
            <div className="section-box">
              <PrayerTimesCard city="Creteil" country="France" />
            </div>
          </div>
        </div>

        {/* Jumu'a section (below prayer times) */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Jumu&apos;a</div>
            <div className="section-box">
              <JumaaCard />
            </div>
          </div>
        </div>

        {/* Informations pratiques */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Informations pratiques</div>
            <div className="grid gap-3 section-box">
              <InfoItem icon={<Car size={16} />} label="Parking" value={true} />
              <InfoItem icon={<Users size={16} />} label="Salle femmes" value={true} />
              <InfoItem icon={<Accessibility size={16} />} label="Accès PMR" value={true} />
              <InfoItem icon={<Languages size={16} />} label="Langue du khutba" text="Français" />
              <InfoItem icon={<Users size={16} />} label="Nombre de khutbas" text="2" />
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

        {/* Footer */}
        <div className="app-card mt-4">
          <div className="text-[13px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} {MOSQUE_NAME}. Mentions légales · Confidentialité · Contact
          </div>
        </div>
      </div>

      {/* Sticky donate button */}
      <a href="/step-amount-v2" className="sticky-donate btn-primary pressable">
        Faire un don
      </a>
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

function PrayerTimesCard({ city, country }: { city: string; country: string }) {
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=12`;
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        if (!json || json.code !== 200) throw new Error("API error");
        if (!cancelled) setTimes(json.data.timings);
      } catch {
        if (!cancelled) setError("Impossible de charger les horaires");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTimes();
    return () => { cancelled = true; };
  }, [city, country]);

  const { nextName, nextTime, list } = useMemo(() => {
    if (!times) return { nextName: null as string | null, nextTime: null as string | null, list: [] as Array<{ key: string; label: string; time: string; isNext: boolean; date?: Date }> };
    const order: Array<{ key: keyof typeof times; label: string }> = [
      { key: "Fajr", label: "Fajr" },
      { key: "Sunrise", label: "Shurûq" },
      { key: "Dhuhr", label: "Dhuhr" },
      { key: "Asr", label: "Asr" },
      { key: "Maghrib", label: "Maghrib" },
      { key: "Isha", label: "Isha" },
    ];
    const now = new Date();
    let nextK: string | null = null;
    let nextT: string | null = null;

    const items: Array<{ key: string; label: string; time: string; date: Date }> = order.map(({ key, label }) => {
      const t = times[key] as string;
      const [hh, mm] = (t || "00:00").split(":").map((x: string) => parseInt(x, 10));
      const dt = new Date(); dt.setHours(hh, mm, 0, 0);
      return { key, label, time: t, date: dt };
    });

    for (const it of items) {
      if (it.date.getTime() > now.getTime()) { nextK = it.label; nextT = it.time; break; }
    }
    if (!nextK) { nextK = items[0].label; nextT = items[0].time; }

    const listed = items.map((it) => ({ key: it.key, label: it.label, time: it.time, isNext: it.label === nextK }));
    return { nextName: nextK, nextTime: nextT, list: listed };
  }, [times]);

  if (loading) {
    return <div className="text-[14px] text-[var(--text-muted)]">Chargement des horaires…</div>;
  }
  if (error) {
    return <div className="text-[14px] text-red-600">{error}</div>;
  }
  if (!times) {
    return <div className="text-[14px] text-[var(--text-muted)]">Aucun horaire disponible.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[14px] text-[var(--text)]">
        <Clock size={16} />
        <span>Prochaine prière: <strong>{nextName}</strong> à <strong>{nextTime}</strong></span>
      </div>
      <div className="grid gap-2">
        {list.map((it) => (
          <div key={it.key} className={`summary-row ${it.isNext ? "ring-2 ring-[var(--focus)]" : ""}`}>
            <span className="text-[14px] font-[600] text-[var(--text)]">{it.label}</span>
            <span className="text-[14px] text-[var(--text)]">{it.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

