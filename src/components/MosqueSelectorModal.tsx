"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { MOSQUES } from "@/lib/mosques";

interface MosqueSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMosque?: string;
  onMosqueSelect: (mosque: string) => void;
}

export function MosqueSelectorModal({ isOpen, onClose, currentMosque, onMosqueSelect }: MosqueSelectorModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      containerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
        tabIndex={-1}
        aria-labelledby="mosque-modal-title"
      >
        <div className="modal-header">
          <h2 id="mosque-modal-title" className="modal-title">Sélectionner une mosquée</h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="grid gap-2">
            {MOSQUES.map((mosque) => (
              <button
                key={mosque.slug}
                onClick={() => {
                  onMosqueSelect(mosque.slug); // Envoie le slug, pas le nom
                  onClose();
                }}
                className={cn(
                  "mosque-option",
                  mosque.slug === currentMosque && "selected"
                )}
              >
                Mosquée de {mosque.displayName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

