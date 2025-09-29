"use client";

import { useState } from "react";
import { SideMenu } from "@/components";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BenevolatPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [days, setDays] = useState<Record<string, boolean>>({ Lun:false, Mar:false, Mer:false, Jeu:false, Ven:false, Sam:false, Dim:false });
  const [duration, setDuration] = useState<string>("");
  const [helpNeena, setHelpNeena] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <HeaderPrimary onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="app-container">
        <Card>
          <CardHeader className="app-title">Devenir bénévole</CardHeader>
          <CardContent className="space-y-6">
            {/* Identité + Contact (espacement uniforme) */}
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" />
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" />
              </div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" inputMode="tel" />
            </div>

            {/* Compétences */}
            <div className="grid gap-2">
              <div className="text-[14px] font-[700] text-[var(--text)]">Compétences{skills.length ? ` (${skills.length})` : ""}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-10 border border-[var(--border)] p-2">
                {["Informatique", "Sécurité", "Accueil", "Communication", "Entretien", "Pas précisé"].map((opt) => {
                  const active = skills.includes(opt);
                  return (
                    <Button
                      key={opt}
                      type="button"
                      variant="secondary"
                      className={`w-full ${active ? '!bg-[var(--text)] !text-white' : ''}`}
                      aria-pressed={active}
                      onClick={() =>
                        setSkills((prev) =>
                          prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt]
                        )
                      }
                    >
                      {opt}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Disponibilités */}
            <div className="grid gap-2">
              <div className="text-[14px] font-[700] text-[var(--text)]">Disponibilités{Object.values(days).some(Boolean) ? ` (${Object.values(days).filter(Boolean).length})` : ""}</div>
              <div className="grid grid-cols-3 gap-2 rounded-10 border border-[var(--border)] p-2">
                {Object.keys(days).map((d) => {
                  const active = !!days[d];
                  return (
                    <Button
                      key={d}
                      type="button"
                      variant="secondary"
                      className={`w-full ${active ? '!bg-[var(--text)] !text-white' : ''}`}
                      aria-pressed={active}
                      onClick={() => setDays((prev) => ({ ...prev, [d]: !prev[d] }))}
                    >
                      {d}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Durée d'engagement */}
            <div className="grid gap-2">
              <div className="text-[14px] font-[700] text-[var(--text)]">Durée d&apos;engagement{duration ? ` (${duration})` : ''}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-10 border border-[var(--border)] p-2">
                {["1 mois", "3 mois", "1 an", "Tout le temps"].map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant="secondary"
                    className={`w-full ${duration === opt ? '!bg-[var(--text)] !text-white' : ''}`}
                    aria-pressed={duration === opt}
                    onClick={() => setDuration(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="grid gap-2">
              <div className="text-[14px] font-[700] text-[var(--text)]">Informations supplémentaires</div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="text-[14px]">Souhaitez-vous également être dans la base de bénévole de l&apos;association Neena ?</div>
                  <div className="grid grid-cols-2 gap-2 rounded-10 border border-[var(--border)] p-2">
                    {["Non", "Oui"].map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        variant="secondary"
                        className={`w-full ${((opt === "Oui") === helpNeena) ? '!bg-[var(--text)] !text-white' : ''}`}
                        aria-pressed={((opt === "Oui") === helpNeena)}
                        onClick={() => setHelpNeena(opt === "Oui")}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message (infos utiles)" />
              </div>
            </div>

            <div>
              <Button className="w-full !bg-black !text-white hover:!bg-black/90" size="lg">Envoyer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

