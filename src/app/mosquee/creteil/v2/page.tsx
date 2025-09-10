"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/ui/header";
import { MapPin, Mail } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;

export default function MosqueCreteilV2Page() {
  const params = useSearchParams();
  const hero = params.get("img") || "/hero-creteil.png";

  return (
    <main className="app-container pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
      <Header
        center={<span>{MOSQUE_NAME}</span>}
        right={<a href="/mosquee/creteil" className="text-[13px] text-[var(--text-muted)] underline">Revenir à V1</a>}
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
          <div className="mt-3 flex gap-3">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="secondary" className="w-full"><MapPin size={16} className="mr-2" />Itinéraire</Button>
            </a>
            <a href="/step-amount-v2" className="flex-1">
              <Button className="w-full"><Mail size={16} className="mr-2" />Faire un don</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Horaire & Prière actuelle (placeholder for brevity) */}
      <div className="grid gap-4 mt-4">
        <Card>
          <CardHeader>
            <div className="text-[15px] font-[700]">Heure et prière actuelles</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[var(--text-muted)]">mercredi 12 mars 2025</div>
                <div className="text-[12px] text-[var(--text-muted)] mt-1">11 Sha'ban 1446</div>
              </div>
              <div className="text-[28px] font-[900]">13:54</div>
            </div>
            <Separator />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[14px]">Prière actuelle</div>
              <Badge>restant avant Dhuhr</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Horaires de prière (table simplifiée) */}
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

        {/* Bénévolat & Newsletter */}
        <Card>
          <CardHeader>
            <div className="text-[15px] font-[700]">Bénévolat</div>
          </CardHeader>
          <CardContent>
            <div className="text-[13px] text-[var(--text-muted)] mb-3">Rejoignez l’équipe pour soutenir l’organisation des prières et événements.</div>
            <Button variant="secondary">Devenir bénévole</Button>
          </CardContent>
        </Card>

        <Card>
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

