"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type SideMenuProps = { 
  isOpen: boolean; 
  onClose: () => void;
  variant?: "neena" | "mosquee";
  mosqueeSlug?: string;
};

export function SideMenu({ isOpen, onClose, variant = "neena", mosqueeSlug = "creteil" }: SideMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop avec blur - Apple style */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-2xl transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)"
        }}
        >
        {/* Header avec logo et bouton fermer - Apple style */}
        <div 
          className="absolute top-0 left-0 right-0 z-10" 
          style={{ 
            paddingTop: "env(safe-area-inset-top)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)"
          }}
        >
          <div className="flex items-center justify-between px-5 h-16">
            {/* Logo Neena - même position que la page principale */}
            <a href="/qui-sommes-nous" className="text-[20px] font-[900] text-white tracking-[-0.5px] hover:opacity-70 transition-opacity">
              Neena
            </a>
            
            {/* Bouton fermer - Apple style */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-xl transition-all active:scale-95"
            >
              <X size={20} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Navigation Centrée - Apple style */}
        <div className="h-full flex items-center justify-center px-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="w-full max-w-md py-12">
            <nav className="space-y-8">
              {/* Section MOSQUÉE (seulement si variant mosquee) */}
              {variant === "mosquee" && (
                <div>
                  <div className="px-4 mb-2">
                    <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Mosquée de Créteil</p>
                  </div>
                  <div className="space-y-1">
                    <Link href={`/mosquee/${mosqueeSlug}/v8`} onClick={onClose}>
                      <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                        Information sur la mosquée
                      </div>
                    </Link>

                    <a href="https://billing.stripe.com/p/login/aEU8Ad04d5MMabufYY" target="_blank" rel="noopener noreferrer" onClick={onClose}>
                      <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                        Gérer mon abonnement
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* Section NEENA */}
              {variant === "neena" && (
                <div>
                  <div className="px-4 mb-2">
                    <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Neena</p>
                  </div>
                  <div className="space-y-1">
                    <Link href="/qui-sommes-nous" onClick={onClose}>
                      <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                        Qui est Neena ?
                      </div>
                    </Link>

                    <Link href="/mosquees" onClick={onClose}>
                      <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                        Mosquées partenaires
                      </div>
                    </Link>

                    <Link href="/constructions" onClick={onClose}>
                      <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                        Projets de construction
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Section SERVICES */}
              <div>
                <div className="px-4 mb-2">
                  <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Services</p>
                </div>
                <div className="space-y-1">
                  <Link href="/duaa" onClick={onClose}>
                    <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                      Demander une Duaa
                    </div>
                  </Link>

                  <Link href="/benevolat" onClick={onClose}>
                    <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                      Devenir bénévole
                    </div>
                  </Link>
                </div>
              </div>

              {variant === "mosquee" && (
                <div>
                  <div className="px-4 mb-2">
                    <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Neena</p>
                  </div>
                  <div className="space-y-1">
                    <Link href="/qui-sommes-nous" onClick={onClose}>
                      <div className="py-3 px-4 text-[19px] font-semibold text-white hover:text-white/80 hover:bg-white/8 rounded-2xl transition-all leading-tight active:scale-[0.98]">
                        Qui est Neena ?
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Bouton selon variant */}
              <div className="pt-4 px-4">
                {variant === "mosquee" ? (
                  <Link href="/step-amount-v26" onClick={onClose}>
                    <div className="py-3 px-4 bg-white text-black font-semibold text-[16px] rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] text-center">
                      Faire un don
                    </div>
                  </Link>
                ) : (
                  <Link href="/auth/login" onClick={onClose}>
                    <div className="py-3 px-4 bg-white text-black font-semibold text-[16px] rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] text-center">
                      Se connecter
                    </div>
                  </Link>
                )}
              </div>

            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

