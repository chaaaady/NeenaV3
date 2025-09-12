"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function SideMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        const menuElement = document.getElementById('side-menu');
        if (menuElement && !menuElement.contains(target)) {
          onClose();
        }
      };
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('click', handleClickOutside);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="side-menu"
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50",
        "border-l border-[var(--border)]",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <h2 className="text-[20px] font-[700] text-[var(--text)]">Menu</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-10 h-10 rounded-[var(--radius-all)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
        >
          <X size={20} className="text-[var(--text-muted)]" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <nav className="space-y-2">
          {/* Mosquée - Créteil */}
          <div className="px-2 pt-2 pb-1 text-[12px] font-[700] text-[var(--text-muted)]">Mosquée · Créteil</div>
          <Link href="/mosquee/creteil" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              V1
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Page mosquée</span>
            </span>
          </Link>

          {/* Don - Montant */}
          <div className="px-2 pt-3 pb-1 text-[12px] font-[700] text-[var(--text-muted)]">Don · Montant</div>
          <Link href="/step-amount-v2" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              V2
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Montant</span>
            </span>
          </Link>

          {/* Don - Infos personnelles */}
          <div className="px-2 pt-3 pb-1 text-[12px] font-[700] text-[var(--text-muted)]">Don · Infos personnelles</div>
          <Link href="/step-personal-v2" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              V2
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Infos</span>
            </span>
          </Link>
          <Link href="/step-personnal-v5" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              V5 (test)
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Infos</span>
            </span>
          </Link>

          {/* Don - Paiement */}
          <div className="px-2 pt-3 pb-1 text-[12px] font-[700] text-[var(--text-muted)]">Don · Paiement</div>
          <Link href="/step-payment" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              V1
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Paiement</span>
            </span>
          </Link>

          {/* Autres */}
          <div className="px-2 pt-3 pb-1 text-[12px] font-[700] text-[var(--text-muted)]">Autres</div>
          <Link href="/duaa" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              Duaa
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Flux prières</span>
            </span>
          </Link>
          <Link href="/benevolat" className="block" onClick={onClose}>
            <span className="w-full flex items-center justify-between p-3 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left text-[15px] font-[700] text-[var(--text)]">
              Bénévolat
              <span className="text-[13px] font-[600] text-[var(--text-muted)]">Rejoindre</span>
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

