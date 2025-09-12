"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/ui/header";
import { MapPin, Mail } from "lucide-react";
import CurrentPrayerSection from "@/components/CurrentPrayerSection";
import CurrentTimeSection from "@/components/CurrentTimeSection";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilV4Page() {
  return (
    <Suspense fallback={<div />}> 
      <V4Content />
    </Suspense>
  );
}

function V4Content() {
  const params = useSearchParams();
  const heroImages = useMemo(() => {
    const url = params.get("img");
    return [url || "/hero-creteil.png", "/hero-creteil-2.png"]; 
  }, [params]);
  const [slide, setSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isHeroPaused) setSlide((s) => (s + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [heroImages.length, isHeroPaused]);

  return (
    <main className="app-container pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
      <Header
        center={<span>{MOSQUE_NAME} · V4</span>}
        right={<a href="/mosquee/creteil" className="text-[13px] text-[var(--text-muted)] underline">Voir V1</a>}
      />

      {/* Hero (style V1, composants shadcn pour la carte) */}
      <Card className="rounded-[12px]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardContent className="p-0">
          <div
            ref={heroRef}
            className="w-full rounded-12 overflow-hidden relative h-[260px]"
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
            {/* Overlay titre/adresse */}
            <div className="absolute left-3 bottom-3 z-20">
              <div className="backdrop-blur-sm bg-white/70 rounded-10 px-3 py-2 shadow-sm">
                <div className="text-[18px] font-[800] text-[var(--text)] leading-none">{MOSQUE_NAME}</div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{MOSQUE_ADDRESS}</span>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div className="absolute bottom-2 right-2 flex gap-1 bg-white/60 rounded-full px-2 py-1">
              {heroImages.map((_, i) => (
                <span key={i} className={"w-2 h-2 rounded-full " + (slide === i ? "bg-[var(--text)]" : "bg-[var(--text-muted)]/60")} />
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-3 p-4 pt-3">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="secondary" className="w-full"><MapPin size={16} className="mr-2" />Itinéraire</Button>
            </a>
            <a href="/step-amount-v2" className="flex-1">
              <Button className="w-full"><Mail size={16} className="mr-2" />Faire un don</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Heure & Prière actuelle (proche V1, encapsulé dans cartes shadcn) */}
      <div className="grid gap-4 mt-4">
        <Card className="rounded-[12px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <div className="text-[15px] font-[700]">Heure et prière actuelles</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CurrentTimeSection embedded />
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-[14px]">Prière actuelle</div>
                <Badge>mise à jour en direct</Badge>
              </div>
              <CurrentPrayerSection slug={(params.get("slug") || "mosquee-sahaba-creteil").trim()} url={params.get("url") || undefined} embedded />
            </div>
          </CardContent>
        </Card>

        {/* Horaires simplifiés */}
        <Card className="rounded-[12px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-[700]">Horaires de prière</div>
              <Badge>Source Mawaqit</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[12px] text-[var(--text-muted)] flex items-center px-2">
              <div className="flex-1" />
              <div className="w-[64px] text-center">Adhan</div>
              <div className="w-[64px] text-center">Iqama</div>
            </div>
            <div className="mt-2 grid gap-2">
              {["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((p) => (
                <div key={p} className="summary-row">
                  <div className="flex-1 text-[14px] font-[700]">{p}</div>
                  <div className="w-[64px] text-center text-[14px] font-[700]">--:--</div>
                  <div className="w-[64px] text-center text-[14px] font-[700]">--:--</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Jumu'a */}
        <Card className="rounded-[12px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <div className="text-[15px] font-[700]">Jumu&apos;a</div>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="summary-row"><span className="text-[14px] font-[600]">Heure Jumu&apos;a</span><span className="text-[14px]">13:30</span></div>
            <div className="summary-row"><span className="text-[14px] font-[600]">Iqama Jumu&apos;a</span><span className="text-[14px]">13:40</span></div>
            <div className="summary-row"><span className="text-[14px] font-[600]">Langues du khutba</span><span className="text-[14px]">Français, Arabe</span></div>
          </CardContent>
        </Card>

        {/* Bénévolat & Newsletter */}
        <Card className="rounded-[12px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <div className="text-[15px] font-[700]">Bénévolat</div>
          </CardHeader>
          <CardContent>
            <div className="text-[13px] text-[var(--text-muted)] mb-3">Rejoignez l’équipe pour soutenir l’organisation des prières et événements.</div>
            <Button variant="secondary">Devenir bénévole</Button>
          </CardContent>
        </Card>

        <Card className="rounded-[12px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <div className="text-[15px] font-[700]">Newsletter</div>
          </CardHeader>
          <CardContent>
            <div className="text-[13px] text-[var(--text-muted)] mb-3">Recevez les horaires & annonces importantes (1 à 2 emails/mois).</div>
            <Button onClick={() => alert("Inscription réussie !")}>S’inscrire</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

"use client";

import Component from "@/components/comp-577";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { MapPin, Mail } from "lucide-react";

export default function MosqueCreteilV4Page() {
  return (
    <main className="app-container pb-24">
      {/* Origin UI header */}
      <Component />

      {/* Showcase of sections using shadcn-style UI */}
      <div className="mt-4 grid gap-4">
        <Card>
          <CardHeader>
            <div className="text-[15px] font-[700]">Heure et prière</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[var(--text-muted)]">mercredi 12 mars 2025</div>
                <div className="text-[12px] text-[var(--text-muted)] mt-1">11 Sha&apos;ban 1446</div>
              </div>
              <div className="text-[28px] font-[900]">13:54</div>
            </div>
            <Separator />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[14px]">Prochaine • Dhuhr</div>
              <Badge>restant avant la prière</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-[15px] font-[700]">Horaires</div>
          </CardHeader>
          <CardContent>
            <div className="text-[12px] text-[var(--text-muted)] flex items-center px-2">
              <div className="flex-1" />
              <div className="w-[64px] text-center">Adhan</div>
              <div className="w-[64px] text-center">Iqama</div>
            </div>
            <div className="mt-2 grid gap-2">
              {["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((p) => (
                <div key={p} className="summary-row">
                  <div className="flex-1 text-[14px] font-[700]">{p}</div>
                  <div className="w-[64px] text-center text-[14px] font-[700]">--:--</div>
                  <div className="w-[64px] text-center text-[14px] font-[700]">--:--</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-[15px] font-[700]">Jumu&apos;a</div>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="summary-row"><span className="text-[14px] font-[600]">Heure Jumu&apos;a</span><span className="text-[14px]">13:30</span></div>
            <div className="summary-row"><span className="text-[14px] font-[600]">Iqama Jumu&apos;a</span><span className="text-[14px]">13:40</span></div>
          </CardContent>
        </Card>

        <div>
          <div className="text-[15px] font-[700] mb-2">FAQ</div>
          <Accordion>
            <AccordionItem title="À propos des horaires">
              Les horaires proviennent de Mawaqit et sont mis à jour régulièrement.
            </AccordionItem>
            <AccordionItem title="Affichage vendredi">
              Le vendredi, Jumu’a remplace l’affichage de Dhuhr.
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="w-full"><MapPin size={16} className="mr-2" />Itinéraire</Button>
          <Button variant="secondary" className="w-full"><Mail size={16} className="mr-2" />Faire un don</Button>
        </div>
      </div>
    </main>
  );
}

