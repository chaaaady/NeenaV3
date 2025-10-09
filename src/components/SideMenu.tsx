"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function SideMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Menu plein écran avec glassmorphisme */}
      <div 
        className={`fixed inset-0 z-[101] flex items-center justify-center transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div 
          className="relative w-[90vw] max-w-md max-h-[80vh] overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.22] to-white/[0.15] backdrop-blur-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-[18px] font-[700] text-white">Menu</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

                  <div className="p-4 space-y-2">
                    <nav className="space-y-2">
                      <Link href="/mosquees" className="block" onClick={onClose}>
                        <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                          Mosquées partenaires
                          <span className="text-[13px] font-[600] text-white/70">Liste</span>
                        </span>
                      </Link>

                      <Link href="/mosquee/creteil/v8" className="block" onClick={onClose}>
                        <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                          Mosquée V8
                          <span className="text-[13px] font-[600] text-white/70">Créteil</span>
                        </span>
                      </Link>

                      <Link href="/mosquee/creteil/v9" className="block" onClick={onClose}>
                        <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                          Mosquée V9
                          <span className="text-[13px] font-[600] text-white/70">Ivry 🏗️</span>
                        </span>
                      </Link>

              <Link href="/qui-sommes-nous" className="block" onClick={onClose}>
                <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                  Qui sommes-nous
                  <span className="text-[13px] font-[600] text-white/70">À propos</span>
                </span>
              </Link>

              <Link href="/duaa" className="block" onClick={onClose}>
                <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                  Duaa
                  <span className="text-[13px] font-[600] text-white/70">Flux prières</span>
                </span>
              </Link>

              <Link href="/benevolat" className="block" onClick={onClose}>
                <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                  Bénévolat
                  <span className="text-[13px] font-[600] text-white/70">Rejoindre</span>
                </span>
              </Link>

              <Link href="/merci" className="block" onClick={onClose}>
                <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                  Merci
                  <span className="text-[13px] font-[600] text-white/70">Succès</span>
                </span>
              </Link>

              <a href="https://billing.stripe.com/p/login/aEU8Ad04d5MMabufYY" target="_blank" rel="noopener noreferrer" className="block" onClick={onClose}>
                <span className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left text-[16px] font-[700] text-white">
                  Gérer mon abonnement
                  <span className="text-[13px] font-[600] text-white/70">Stripe</span>
                </span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

