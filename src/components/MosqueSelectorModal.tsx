"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function MosqueSelectorModal({ 
  isOpen, 
  onClose, 
  currentMosque,
  onMosqueSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  currentMosque?: string;
  onMosqueSelect: (mosque: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        const modalElement = document.getElementById('mosque-selector-modal');
        if (modalElement && !modalElement.contains(target)) {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const el = containerRef.current;
        if (!el) return;
        const focusables = el.querySelectorAll<HTMLElement>('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            (lastEl as HTMLElement).focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            (firstEl as HTMLElement).focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mosquesIleDeFrance = [
    "Créteil", "Grande Mosquée de Paris", "Mosquée de Bobigny",
    "Mosquée de Saint-Denis", "Mosquée de Nanterre", "Mosquée de Argenteuil",
    "Mosquée de Montreuil", "Mosquée de Vitry-sur-Seine",
    "Mosquée de Champigny-sur-Marne", "Mosquée de Meaux",
    "Mosquée de Évry-Courcouronnes", "Mosquée de Corbeil-Essonnes",
    "Mosquée de Mantes-la-Jolie", "Mosquée de Pontoise",
    "Mosquée de Melun", "Mosquée de Drancy", "Mosquée de Aubervilliers",
    "Mosquée de La Courneuve", "Mosquée de Sarcelles",
    "Mosquée de Villiers-sur-Marne"
  ];

  return (
    <div 
      id="mosque-selector-modal"
      role="dialog" aria-modal="true" aria-label="Mosque selector"
      className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[var(--radius-all)] shadow-2xl z-50",
        "border border-[var(--border)]",
        "transition-all duration-200 ease-out",
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
      )}
      onClick={(e) => e.stopPropagation()}
      ref={containerRef}
      tabIndex={-1}
    >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-[20px] font-[700] text-[var(--text)]" id="mosque-modal-title">Sélectionner une mosquée</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-10 h-10 rounded-[var(--radius-all)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="p-4 max-h:[60vh] overflow-y-auto">
          <div className="space-y-2">
            {mosquesIleDeFrance.map((mosque) => (
              <button
                key={mosque}
                onClick={(e) => {
                  e.stopPropagation();
                  onMosqueSelect(mosque);
                  onClose();
                }}
                className={cn(
                  "w-full text-left p-4 rounded-[var(--radius-all)] border transition-all duration-150 ease-in-out",
                  currentMosque === mosque
                    ? "border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)]"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]/30 hover:bg-[var(--brand)]/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-[var(--radius-all)] flex items-center justify-center",
                    currentMosque === mosque ? "bg-[var(--brand)]" : "bg-[var(--surface-2)]"
                  )}>
                    <span className={cn(
                      "font-[700] text-[12px]",
                      currentMosque === mosque ? "text-white" : "text-[var(--text-muted)]"
                    )}>
                      M
                    </span>
                  </div>
                  <span className="text-[16px] font-[600]">{mosque}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
    </div>
  );
}

