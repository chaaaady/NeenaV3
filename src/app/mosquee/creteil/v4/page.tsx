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

