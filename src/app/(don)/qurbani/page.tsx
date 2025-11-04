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

type AnimalType = "mouton" | "chevre" | "vache" | "chameau";

interface AnimalOption {
  type: AnimalType;
  name: string;
  price: number;
  parts: number;
  description: string;
  emoji: string;
}

const ANIMALS: AnimalOption[] = [
  {
    type: "mouton",
    name: "Mouton",
    price: 150,
    parts: 1,
    description: "Pour 1 personne",
    emoji: "🐑"
  },
  {
    type: "chevre",
    name: "Chèvre",
    price: 140,
    parts: 1,
    description: "Pour 1 personne",
    emoji: "🐐"
  },
  {
    type: "vache",
    name: "Vache (1/7)",
    price: 100,
    parts: 7,
    description: "Part pour 1 personne",
    emoji: "🐄"
  },
  {
    type: "chameau",
    name: "Chameau (1/7)",
    price: 120,
    parts: 7,
    description: "Part pour 1 personne",
    emoji: "🐫"
  }
];

export default function QurbaniPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>("mouton");
  const [quantity, setQuantity] = useState(1);
  const { canProceedFromAmount } = useDonationFlow();

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#8b5a3c"; // Brown for Qurbani
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


  // Initialize form values for Qurbani
  useEffect(() => {
    form.setValue("frequency", "Unique", { shouldDirty: true });
    form.setValue("donationType", "Sadaqah", { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update amount when animal or quantity changes
  useEffect(() => {
    const animal = ANIMALS.find(a => a.type === selectedAnimal);
    if (animal) {
      const totalAmount = animal.price * quantity;
      form.setValue("amount", totalAmount, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnimal, quantity]);

  const handleNext = () => {
    if (canProceedFromAmount(values)) {
      router.push("/step-personal-ds");
    }
  };

  const currentAnimal = ANIMALS.find(a => a.type === selectedAnimal);
  const totalAmount = currentAnimal ? currentAnimal.price * quantity : 0;

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="mosquee" mosqueeSlug="creteil" />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      <div className="relative w-full bg-gradient-to-b from-[#8b5a3c] via-[#a0694d] to-[#8b5a3c]" style={{ height: "100svh", overflow: "hidden" }}>
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
                  Qurbani - Aïd al-Adha
                </h1>
                <p className="text-center text-white/90 text-[14px] mb-4">
                  Pour la {" "}
                  <button onClick={() => setShowMosqueSelector(true)} className="underline decoration-white/40 underline-offset-4 hover:decoration-white transition-all">
                    mosquée de {getMosqueDisplayName(values.mosqueName)}
                  </button>
                </p>

                <div className="mt-4 space-y-6">
                  {/* Animal selection */}
                  <div className="w-full rounded-2xl bg-white/10 p-3.5">
                    <p className="text-white text-[15px] font-semibold mb-3 text-center">
                      Choisissez votre animal
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {ANIMALS.map((animal) => (
                        <button
                          key={animal.type}
                          onClick={() => {
                            setSelectedAnimal(animal.type);
                            setQuantity(1);
                          }}
                          className={`p-3 rounded-xl transition-all ${
                            selectedAnimal === animal.type
                              ? "bg-white/30 border-2 border-white/50 shadow-lg"
                              : "bg-white/10 border border-white/20 hover:bg-white/20"
                          }`}
                        >
                          <div className="text-[32px] mb-1">{animal.emoji}</div>
                          <div className="text-white text-[14px] font-semibold">{animal.name}</div>
                          <div className="text-white/80 text-[12px] mb-1">{animal.description}</div>
                          <div className="text-white text-[16px] font-bold">{formatEuro(animal.price)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="w-full rounded-2xl bg-white/10 p-3.5">
                    <p className="text-white text-[15px] font-semibold mb-3 text-center">
                      Quantité
                    </p>
                    
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[24px] font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white text-[24px] font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total amount display */}
                  <div className="w-full rounded-2xl bg-white/10 p-3.5">
                    <div className="text-center mb-3">
                      <p className="text-white text-[16px] font-bold mb-2">Montant total</p>
                      <p className="text-white text-[36px] font-bold leading-none">
                        {formatEuro(totalAmount)}
                      </p>
                    </div>
                    
                    <p className="pl-4 pr-3 text-left text-[15px] text-white leading-relaxed">
                      Votre don de {formatEuro(totalAmount)} ne vous coûtera que
                      {" "}
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

