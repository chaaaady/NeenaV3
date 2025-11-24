"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { SideMenu, DesktopSidebar } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { GlassCard, GlassInput, GlassSelect, PrimaryButton } from "@/components/ds";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";

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
  const [isMobile, setIsMobile] = useState(true);

  // Déterminer la prière actuelle et le background correspondant
  const currentPrayer = useCurrentPrayer("mosquee-sahaba-creteil");
  
  const PRAYER_BACKGROUNDS: Record<string, { image: string; flip: boolean; statusBarColor: string }> = {
    fajr: { image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
    dhuhr: { image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
    asr: { image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
    maghrib: { image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
    isha: { image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
  };
  
  const currentBackground = useMemo(() => 
    PRAYER_BACKGROUNDS[currentPrayer] || PRAYER_BACKGROUNDS.fajr,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPrayer]
  );

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set theme-color for iPhone notch - dynamically based on current prayer
  useEffect(() => {
    const themeColor = currentBackground.statusBarColor;
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
  }, [currentBackground.statusBarColor]);

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Header mobile only */}
      {isMobile && <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="relative w-full min-h-[100svh]">
        {/* Background image dynamique selon la prière actuelle */}
        <div 
          className="fixed inset-0 overflow-hidden" 
          style={{ 
            top: "calc(-1 * env(safe-area-inset-top))",
            bottom: "calc(-1 * env(safe-area-inset-bottom))",
            left: "calc(-1 * env(safe-area-inset-left))",
            right: "calc(-1 * env(safe-area-inset-right))"
          }}
        >
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${currentBackground.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: currentBackground.flip ? 'scaleY(-1)' : 'none',
            }}
          />
          
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Wrapper pour centrer le contenu entre le sidebar et le bord droit */}
        <div className="lg:ml-64 lg:flex lg:justify-center lg:items-start lg:min-h-screen">
          <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6 max-w-3xl w-full mx-auto">
          {/* Hero Card with Image */}
          <ScrollReveal delay={0}>
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
              <h2 className="text-[16px] font-[700] text-white">Compétences</h2>
              <GlassSelect
                value={skills[0] || ""}
                onChange={(value) => setSkills(value ? [value] : [])}
                placeholder="Sélectionner une compétence"
                options={[
                  { value: "Informatique", label: "Informatique" },
                  { value: "Sécurité", label: "Sécurité" },
                  { value: "Accueil", label: "Accueil" },
                  { value: "Communication", label: "Communication" },
                  { value: "Entretien", label: "Entretien" },
                  { value: "Enseignement", label: "Enseignement" },
                  { value: "Cuisine", label: "Cuisine" },
                  { value: "Administratif", label: "Administratif" },
                  { value: "Autre", label: "Autre" },
                ]}
              />
            </div>

            {/* Disponibilités */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Disponibilités</h2>
              <GlassSelect
                value={Object.keys(days).find(d => days[d]) || ""}
                onChange={(value) => {
                  const newDays = { Lun:false, Mar:false, Mer:false, Jeu:false, Ven:false, Sam:false, Dim:false };
                  if (value) newDays[value as keyof typeof newDays] = true;
                  setDays(newDays);
                }}
                placeholder="Sélectionner un jour"
                options={[
                  { value: "Lun", label: "Lundi" },
                  { value: "Mar", label: "Mardi" },
                  { value: "Mer", label: "Mercredi" },
                  { value: "Jeu", label: "Jeudi" },
                  { value: "Ven", label: "Vendredi" },
                  { value: "Sam", label: "Samedi" },
                  { value: "Dim", label: "Dimanche" },
                  { value: "Semaine", label: "Toute la semaine" },
                  { value: "Weekend", label: "Week-end uniquement" },
                ]}
              />
            </div>

            {/* Durée d'engagement */}
            <div className="space-y-3">
              <h2 className="text-[16px] font-[700] text-white">Durée d&apos;engagement</h2>
              <GlassSelect
                value={duration}
                onChange={setDuration}
                placeholder="Sélectionner une durée"
                options={[
                  { value: "1 mois", label: "1 mois" },
                  { value: "3 mois", label: "3 mois" },
                  { value: "6 mois", label: "6 mois" },
                  { value: "1 an", label: "1 an" },
                  { value: "Long terme", label: "Long terme (indéfini)" },
                ]}
              />
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
          </ScrollReveal>
        </main>
        </div>
      </div>
    </>
  );
}
