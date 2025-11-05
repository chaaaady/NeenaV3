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
      {/* Backdrop avec blur */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl transition-all duration-500 ${
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
        {/* Header avec bouton fermer */}
        <div className="absolute top-0 right-0 z-10" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)", paddingRight: "1.5rem" }}>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
          >
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Navigation Centrée */}
        <div className="h-full flex items-center justify-center px-8">
          <div className="w-full max-w-lg space-y-1">
            <nav className="space-y-1">
              {variant === "neena" ? (
                <>
                  <Link href="/auth/login" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Connexion
                    </div>
                  </Link>

                  <Link href="/qui-sommes-nous" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Qui sommes-nous
                    </div>
                  </Link>

                  <Link href="/mosquees" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Mosquées
                    </div>
                  </Link>

                  <Link href="/constructions" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Construction
                    </div>
                  </Link>

                  <Link href="/duaa" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Duaa
                    </div>
                  </Link>

                  <Link href="/benevolat" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Bénévolat
                    </div>
                  </Link>

                  <Link href="/devenir-partenaire" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Partenaire
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Connexion
                    </div>
                  </Link>

                  <Link href={`/mosquee/${mosqueeSlug}/v8`} onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Information
                    </div>
                  </Link>

                  <Link href="/step-amount-v2" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Faire un don
                    </div>
                  </Link>

                  <Link href="/duaa" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Duaa
                    </div>
                  </Link>

                  <Link href="/benevolat" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Bénévolat
                    </div>
                  </Link>

                  <Link href="/qui-sommes-nous" onClick={onClose}>
                    <div className="py-3 text-[32px] md:text-[36px] font-bold text-white hover:text-white/70 transition-colors leading-tight">
                      Qui est Neena
                    </div>
                  </Link>

                  <div className="pt-6 pb-2">
                    <p className="text-white/40 text-[13px] font-semibold uppercase tracking-wider">Spécial</p>
                  </div>

                  <Link href="/zakat-al-fitr" onClick={onClose}>
                    <div className="py-2 text-[24px] md:text-[28px] font-semibold text-white/90 hover:text-white/70 transition-colors leading-tight">
                      Zakat al Fitr
                    </div>
                  </Link>

                  <Link href="/qurbani" onClick={onClose}>
                    <div className="py-2 text-[24px] md:text-[28px] font-semibold text-white/90 hover:text-white/70 transition-colors leading-tight">
                      Qurbani
                    </div>
                  </Link>

                  <Link href="/zakat-al-maal" onClick={onClose}>
                    <div className="py-2 text-[24px] md:text-[28px] font-semibold text-white/90 hover:text-white/70 transition-colors leading-tight">
                      Zakat al Maal
                    </div>
                  </Link>

                  <Link href="/aqiqa" onClick={onClose}>
                    <div className="py-2 text-[24px] md:text-[28px] font-semibold text-white/90 hover:text-white/70 transition-colors leading-tight">
                      Aqiqa
                    </div>
                  </Link>

                  <div className="pt-6 border-t border-white/10 mt-6">
                    <a href="https://billing.stripe.com/p/login/aEU8Ad04d5MMabufYY" target="_blank" rel="noopener noreferrer" onClick={onClose}>
                      <div className="py-2 text-[20px] font-medium text-white/70 hover:text-white/50 transition-colors leading-tight">
                        Gérer mon abonnement
                      </div>
                    </a>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

