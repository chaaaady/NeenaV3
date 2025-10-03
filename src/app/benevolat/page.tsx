"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SideMenu } from "@/components";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { GlassCard, GlassInput, PrimaryButton } from "@/components/ds";

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

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#a8c8e1"; // Blue pastel
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    
    const previousColor = meta.getAttribute("content");
    meta.setAttribute("content", themeColor);
    
    return () => {
      if (previousColor) {
        meta?.setAttribute("content", previousColor);
      } else {
        meta?.remove();
      }
    };
  }, []);

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#a8c8e1] via-[#b8d4e8] to-[#a8c8e1]">
        <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6 max-w-3xl mx-auto">
          {/* Hero Card with Image */}
          <GlassCard className="space-y-6">
            {/* Hero Image */}
            <div className="w-full rounded-2xl overflow-hidden h-[230px] relative">
              <Image src="/benevolat.png" alt="Bénévolat" fill className="object-cover" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-[24px] font-[800] text-white leading-tight">Devenir bénévole</h1>
              <p className="mt-2 text-[14px] text-white/80">Rejoignez l&apos;équipe et contribuez au bon fonctionnement de la mosquée</p>
            </div>

            {/* Identité + Contact */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Vos informations</h2>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <GlassInput value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" />
                  <GlassInput value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" />
                </div>
                <GlassInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
                <GlassInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" inputMode="tel" />
              </div>
            </div>

            {/* Compétences */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Compétences{skills.length ? ` (${skills.length})` : ""}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Informatique", "Sécurité", "Accueil", "Communication", "Entretien", "Pas précisé"].map((opt) => {
                  const active = skills.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`h-11 px-4 rounded-2xl text-[14px] font-[600] transition-all ${
                        active 
                          ? 'bg-white text-black shadow-lg' 
                          : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                      }`}
                      aria-pressed={active}
                      onClick={() =>
                        setSkills((prev) =>
                          prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt]
                        )
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disponibilités */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Disponibilités{Object.values(days).some(Boolean) ? ` (${Object.values(days).filter(Boolean).length})` : ""}</h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(days).map((d) => {
                  const active = !!days[d];
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`h-11 px-4 rounded-2xl text-[14px] font-[600] transition-all ${
                        active 
                          ? 'bg-white text-black shadow-lg' 
                          : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                      }`}
                      aria-pressed={active}
                      onClick={() => setDays((prev) => ({ ...prev, [d]: !prev[d] }))}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Durée d'engagement */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Durée d&apos;engagement{duration ? ` (${duration})` : ''}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["1 mois", "3 mois", "1 an", "Tout le temps"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`h-11 px-4 rounded-2xl text-[14px] font-[600] transition-all ${
                      duration === opt 
                        ? 'bg-white text-black shadow-lg' 
                        : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                    }`}
                    aria-pressed={duration === opt}
                    onClick={() => setDuration(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Informations supplémentaires</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[14px] text-white/90">Souhaitez-vous également être dans la base de bénévole de l&apos;association Neena ?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Non", "Oui"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`h-11 px-4 rounded-2xl text-[14px] font-[600] transition-all ${
                          ((opt === "Oui") === helpNeena) 
                            ? 'bg-white text-black shadow-lg' 
                            : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                        }`}
                        aria-pressed={((opt === "Oui") === helpNeena)}
                        onClick={() => setHelpNeena(opt === "Oui")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <GlassInput 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Message (infos utiles)" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <PrimaryButton className="w-full">Envoyer</PrimaryButton>
            </div>
          </GlassCard>
        </main>
      </div>
    </>
  );
}
