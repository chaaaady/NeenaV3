"use client";

import { Info } from "lucide-react";

export function ProductHeader({ 
  currentMosque, 
  onMosqueSelect, 
  onInfoNavigation 
}: { 
  currentMosque?: string;
  onMosqueSelect?: () => void;
  onInfoNavigation?: () => void;
}) {
  return (
    <div className="product-header">
      <div className="product-header-content">
        <div className="flex-1" />
        <button
          onClick={onMosqueSelect}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)] hover:bg-[var(--surface-2)] transition-colors"
        >
          <span className="text-[15px] font-[600] text-[var(--text)]">
            {currentMosque || "Sélectionner une mosquée"}
          </span>
        </button>
        <div className="flex-1 flex justify-end">
          <button
            onClick={onInfoNavigation}
            className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-pill)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Info size={12} className="text-[var(--text-soft)]" />
            <span className="text-[11px] font-[500] text-[var(--text-soft)]">
              Info
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

