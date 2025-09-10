"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { MapPin, Mail } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilV3Page() {
  return (
    <Suspense fallback={<div />}> 
      <V3Content />
    </Suspense>
  );
}

function V3Content() {
  const params = useSearchParams();
  const hero = params.get("img") || "/hero-creteil.png";

  return (
    <main className="app-container pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
      <Header
        center={<span>{MOSQUE_NAME} · V3</span>}
        right={<a href="/mosquee/creteil/v2" className="text-[13px] text-[var(--text-muted)] underline">Voir V2</a>}
      />
      
      {/* Hero */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-[260px] overflow-hidden rounded-12">
            <Image src={hero} alt={MOSQUE_NAME} fill className="object-cover" sizes="(max-width: 600px) 100vw, 600px" />
            <div className="absolute left-3 bottom-3">
              <div className="backdrop-blur-sm bg-white/70 rounded-10 px-3 py-2 shadow-sm">
                <div className="text-[18px] font-[800] text-[var(--text)] leading-none">{MOSQUE_NAME}</div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{MOSQUE_ADDRESS}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="w-full"><MapPin size={16} className="mr-2" />Itinéraire</Button>
            </a>
            <a href="/step-amount-v2">
              <Button className="w-full"><Mail size={16} className="mr-2" />Faire un don</Button>
            </a>
          </div>
        </CardContent>
      </Card>
      
      {/* Heures + Prière */}
      <div className="mt-4 grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-[700]">Heure et prière actuelles</div>
              <Badge>Format 24h</Badge>
            </div>
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
        
        {/* Horaires */}
        <Card>
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
        
        {/* Galerie de styles de cartes (variations) */}
        <div className="mt-2">
          <div className="text-[15px] font-[700] mb-2">Galerie de styles de cartes</div>
          <div className="grid gap-3">
            {/* Standard: header intégré, radius 12, ombre douce */}
            <Card>
              <CardHeader>
                <div className="text-[14px] font-[700]">Standard (header intégré)</div>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
            
            {/* Titre en dehors: titre au-dessus, carte simple sans header */}
            <div>
              <div className="px-1 pb-2 text-[14px] font-[700]">Titre en dehors</div>
              <Card className="rounded-[12px]">
                <CardContent>
                  <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contour fort + sans ombre */}
            <Card className="rounded-[12px] border-2" style={{ boxShadow: 'none' }}>
              <CardHeader>
                <div className="text-[14px] font-[700]">Contour fort (sans ombre)</div>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
            
            {/* Fond doux (surface) + bordure en pointillé */}
            <Card className="bg-[var(--surface-2)] border-dashed rounded-[12px]">
              <CardHeader>
                <div className="text-[14px] font-[700]">Fond doux (dashed)</div>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
            
            {/* Accent gauche (success) */}
            <Card className="rounded-[12px] relative">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-[12px] bg-[var(--success)]" />
              <CardHeader className="pl-5">
                <div className="text-[14px] font-[700]">Accent latéral</div>
              </CardHeader>
              <CardContent className="pl-5">
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
            
            {/* Coins carrés (radius 8px) */}
            <Card className="rounded-[8px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardHeader>
                <div className="text-[14px] font-[700]">Coins carrés (8px)</div>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
            
            {/* Radius fort (20px) + ombre marquée */}
            <Card className="rounded-[20px]" style={{ boxShadow: '0 10px 24px rgba(9,17,33,0.10)' }}>
              <CardHeader>
                <div className="text-[14px] font-[700]">Radius fort (20px)</div>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
            
            {/* Ghost (sans bordure ni ombre) */}
            <Card className="border-transparent" style={{ boxShadow: 'none' }}>
              <CardHeader>
                <div className="text-[14px] font-[700]">Ghost (très discret)</div>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[var(--text-muted)]">Contenu de démonstration</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Jumu'a */}
        <Card>
          <CardHeader>
            <div className="text-[15px] font-[700]">Jumu&apos;a</div>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="summary-row"><span className="text-[14px] font-[600]">Heure Jumu&apos;a</span><span className="text-[14px]">13:30</span></div>
            <div className="summary-row"><span className="text-[14px] font-[600]">Iqama Jumu&apos;a</span><span className="text-[14px]">13:40</span></div>
            <div className="summary-row"><span className="text-[14px] font-[600]">Langues du khutba</span><span className="text-[14px]">Français, Arabe</span></div>
          </CardContent>
        </Card>
        
        {/* FAQ */}
        <div className="mt-2">
          <div className="text-[15px] font-[700] mb-2">FAQ</div>
          <Accordion>
            <AccordionItem title="D’où proviennent les horaires ?">
              Les horaires proviennent de Mawaqit. Ils sont rafraîchis régulièrement via notre API interne.
            </AccordionItem>
            <AccordionItem title="La Jumu’a remplace-t-elle Dhuhr ?">
              Le vendredi, Jumu’a est priorisée et Dhuhr peut être masquée dans l’affichage.
            </AccordionItem>
            <AccordionItem title="Puis-je recevoir un rappel ?">
              Bientôt: inscription pour notifications locales avant chaque prière.
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
}

