"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { formatEuro } from "@/lib/currency";
import { DonationFormValues } from "@/lib/schema";
import { useDonationFlow } from "@/features/donation/useDonationFlow";
import { getMosqueDisplayName } from "@/lib/mosques";

type AnimalType = "mouton" | "chevre";

interface AnimalOption {
  type: AnimalType;
  name: string;
  price: number;
  gender: "male" | "female";
  description: string;
  emoji: string;
}

const ANIMALS: AnimalOption[] = [
  {
    type: "mouton",
    name: "Mouton",
    price: 150,
    gender: "male",
    description: "Pour un garçon (2 moutons)",
    emoji: "🐑"
  },
  {
    type: "mouton",
    name: "Mouton",
    price: 150,
    gender: "female",
    description: "Pour une fille (1 mouton)",
    emoji: "🐑"
  },
  {
    type: "chevre",
    name: "Chèvre",
    price: 140,
    gender: "male",
    description: "Pour un garçon (2 chèvres)",
    emoji: "🐐"
  },
  {
    type: "chevre",
    name: "Chèvre",
    price: 140,
    gender: "female",
    description: "Pour une fille (1 chèvre)",
    emoji: "🐐"
  }
];

export default function AqiqaPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("male");
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>("mouton");
  const [quantity, setQuantity] = useState(1);
  const { canProceedFromAmount } = useDonationFlow();

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5";
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

  // Initialize form values for Aqiqa
  useEffect(() => {
    form.setValue("frequency", "Unique", { shouldDirty: true });
    form.setValue("donationType", "Sadaqah", { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update amount when selection changes
  useEffect(() => {
    const animal = ANIMALS.find(a => a.type === selectedAnimal && a.gender === selectedGender);
    if (animal) {
      const multiplier = selectedGender === "male" ? 2 : 1;
      const totalAmount = animal.price * multiplier * quantity;
      form.setValue("amount", totalAmount, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnimal, selectedGender, quantity]);

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      router.push("/step-personal-ds");
    }
  };

  const currentAnimal = ANIMALS.find(a => a.type === selectedAnimal && a.gender === selectedGender);
  const multiplier = selectedGender === "male" ? 2 : 1;
  const totalAmount = currentAnimal ? currentAnimal.price * multiplier * quantity : 0;

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug="creteil" />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      <div className="relative w-full bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]" style={{ height: "100svh", overflow: "hidden" }}>
        {/* Logo Neena en haut de la page */}
        <div className="absolute top-0 left-0 z-10 p-4">
          <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px] drop-shadow-lg hover:opacity-80 transition-opacity">
            Neena
          </a>
        </div>

        {/* Burger menu mobile en haut à droite */}
        <button 
          aria-label="Menu" 
          onClick={() => setIsMenuOpen(true)} 
          className="absolute top-4 right-4 z-10 md:hidden w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        
        {/* Main content area - starts below header */}
        <div className="relative w-full h-full flex flex-col" style={{ paddingTop: "var(--hdr-primary-h)" }}>
          
          {/* Card - scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
            <div className="w-full max-w-lg md:max-w-xl mx-auto">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-7 transition-all duration-300 ease-out">
                
                <h1 className="text-center text-white font-semibold tracking-tight text-[20px] md:text-[24px] leading-snug mb-1">
                  Aqiqa
                </h1>
                <p className="text-center text-white/70 text-[14px] mb-6">
                  Sacrifice pour la naissance d&apos;un enfant
                </p>

                <button 
                  onClick={() => setShowMosqueSelector(true)} 
                  className="w-full mb-6 p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-left"
                >
                  <p className="text-white/70 text-[12px] mb-1">Mosquée bénéficiaire</p>
                  <p className="text-white text-[15px] font-semibold">
                    {values.mosqueName ? `Mosquée de ${getMosqueDisplayName(values.mosqueName)}` : "Sélectionner une mosquée"}
                  </p>
                </button>

                {/* Hadith */}
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 mb-6">
                  <p className="text-[14px] md:text-[15px] text-white/95 leading-relaxed italic">
                    « Tout enfant est lié à son Aqiqa qui doit être sacrifiée le septième jour de sa naissance. »
                  </p>
                  <p className="text-[13px] text-white/75 mt-2">
                    — Hadith rapporté par Ahmad et les Sunan
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Gender Selection */}
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
                    <h3 className="text-white font-semibold text-[15px] mb-3">Sexe de l&apos;enfant</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedGender("male")}
                        className={`rounded-xl p-4 border transition-all ${
                          selectedGender === "male"
                            ? "bg-white/20 border-white/40 shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-[32px] mb-2">👶</p>
                        <p className="text-white text-[15px] font-semibold">Garçon</p>
                        <p className="text-white/70 text-[12px]">2 animaux</p>
                      </button>
                      <button
                        onClick={() => setSelectedGender("female")}
                        className={`rounded-xl p-4 border transition-all ${
                          selectedGender === "female"
                            ? "bg-white/20 border-white/40 shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-[32px] mb-2">👶</p>
                        <p className="text-white text-[15px] font-semibold">Fille</p>
                        <p className="text-white/70 text-[12px]">1 animal</p>
                      </button>
                    </div>
                  </div>

                  {/* Animal Selection */}
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
                    <h3 className="text-white font-semibold text-[15px] mb-3">Type d&apos;animal</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedAnimal("mouton")}
                        className={`rounded-xl p-4 border transition-all ${
                          selectedAnimal === "mouton"
                            ? "bg-white/20 border-white/40 shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-[32px] mb-2">🐑</p>
                        <p className="text-white text-[15px] font-semibold">Mouton</p>
                        <p className="text-white/70 text-[12px]">{formatEuro(150)}</p>
                      </button>
                      <button
                        onClick={() => setSelectedAnimal("chevre")}
                        className={`rounded-xl p-4 border transition-all ${
                          selectedAnimal === "chevre"
                            ? "bg-white/20 border-white/40 shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-[32px] mb-2">🐐</p>
                        <p className="text-white text-[15px] font-semibold">Chèvre</p>
                        <p className="text-white/70 text-[12px]">{formatEuro(140)}</p>
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
                    <h3 className="text-white font-semibold text-[15px] mb-3 text-center">Nombre d&apos;enfants</h3>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[24px] font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        −
                      </button>
                      <div className="min-w-[70px] text-center">
                        <p className="text-white text-[42px] font-bold leading-none">
                          {quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white text-[24px] font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="rounded-2xl bg-white/15 border border-white/20 p-5 text-center space-y-3">
                    <p className="text-white/80 text-[14px] font-medium uppercase tracking-wide">
                      Montant total
                    </p>
                    <p className="text-white text-[42px] md:text-[48px] font-bold leading-none">
                      {formatEuro(totalAmount)}
                    </p>
                    <p className="text-white/70 text-[13px]">
                      Vous paierez{" "}
                      <strong className="font-semibold text-white">
                        {formatEuro(totalAmount * 0.34)}
                      </strong>
                      {" "}après déduction fiscale.
                    </p>
                  </div>
                </div>

                {/* Button inside card */}
                <div className="mt-6">
                  <button
                    onClick={handleNext}
                    disabled={!(typeof values.amount === "number" && Number.isFinite(values.amount) && values.amount > 0)}
                    className="w-full h-11 rounded-2xl px-6 bg-white text-black font-semibold shadow-xl ring-1 ring-white/70 transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-px hover:brightness-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    Suivant
                    <ArrowRight size={18} className="opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

